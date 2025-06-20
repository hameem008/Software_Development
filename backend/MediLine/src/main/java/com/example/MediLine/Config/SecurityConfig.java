package com.example.MediLine.Config;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.MediLine.Security.JwtAuthenticationFilter;
import com.example.MediLine.Security.JwtUtil;
import com.example.MediLine.Service.RefreshTokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieConfig cookieConfig;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Set-Cookie"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.getWriter().write("Access denied: " + accessDeniedException.getMessage());
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**", "/ping", "/register/**", "/login/**", "/refresh").permitAll()
                        .requestMatchers("/logout").authenticated()
                        .requestMatchers("/patient/**").hasRole("PATIENT")
                        .requestMatchers("/doctor/**").hasRole("DOCTOR")
                        .requestMatchers("/hospital/**").hasRole("HOSPITAL")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .addLogoutHandler((request, response, authentication) -> {
                            logger.info("Processing logout request for URI: {}", request.getRequestURI());
                            logger.info("Cookies: {}",
                                    request.getCookies() != null ? Arrays.toString(request.getCookies()) : "None");
                            logger.info("Authentication before logout: {}", authentication);
                            String email = null;
                            String role = null;

                            // Try to get email and role from authentication
                            if (authentication != null) {
                                email = authentication.getName();
                                // Extract role from authorities
                                role = authentication.getAuthorities().stream()
                                        .map(grantedAuthority -> grantedAuthority.getAuthority())
                                        .filter(auth -> auth.startsWith("ROLE_"))
                                        .findFirst()
                                        .orElse(null);
                                logger.debug("From authentication - Email: {}, Role: {}", email, role);
                            }

                            // Fallback to tokens if authentication is null
                            if (email == null || role == null) {
                                logger.debug("Authentication is null or incomplete; checking tokens");
                                String accessToken = null;
                                String refreshToken = null;
                                if (request.getCookies() != null) {
                                    for (Cookie cookie : request.getCookies()) {
                                        logger.debug("Cookie: {} = {}", cookie.getName(), cookie.getValue());
                                        if ("accessToken".equals(cookie.getName())) {
                                            accessToken = cookie.getValue();
                                        } else if ("refreshToken".equals(cookie.getName())) {
                                            refreshToken = cookie.getValue();
                                        }
                                    }
                                }

                                // Try accessToken first
                                if (accessToken != null && jwtUtil.validateToken(accessToken)) {
                                    email = jwtUtil.getEmailFromToken(accessToken);
                                    role = jwtUtil.getRoleFromToken(accessToken);
                                    logger.info("From access token - Email: {}, Role: {}", email, role);
                                }
                                // Fallback to refreshToken
                                else if (refreshToken != null && refreshTokenService.validateRefreshToken(refreshToken)) {
                                    email = jwtUtil.getEmailFromToken(refreshToken);
                                    role = jwtUtil.getRoleFromToken(refreshToken);
                                    logger.info("From refresh token - Email: {}, Role: {}", email, role);
                                } else {
                                    logger.warn("No valid tokens found");
                                }
                            }

                            // Clear cookies using CookieConfig
                            response.addCookie(cookieConfig.createEmptyAccessTokenCookie());
                            response.addCookie(cookieConfig.createEmptyRefreshTokenCookie());

                            // Delete refresh token from database
                            if (email != null && role != null) {
                                logger.info("Deleting refresh token for email: {}, role: {}", email, role);
                                try {
                                    refreshTokenService.deleteByEmailAndRole(email, role);
                                    logger.info("Successfully deleted refresh token for email: {}, role: {}", email, role);
                                } catch (Exception e) {
                                    logger.error("Failed to delete refresh token for email: {}, role: {}. Error: {}",
                                            email, role, e.getMessage(), e);
                                }
                            } else {
                                logger.warn("Cannot delete refresh token: email or role is null (email: {}, role: {})",
                                        email, role);
                            }
                        })
                        .logoutSuccessHandler((request, response, authentication) -> {
                            logger.info("Logout successful");
                            response.setStatus(HttpServletResponse.SC_OK);
                        })
                );

        return http.build();
    }
}