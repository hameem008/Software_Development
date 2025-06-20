package com.example.MediLine.Security;

import java.io.IOException;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;



@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    private final AuthenticationFailureHandler failureHandler = new SimpleUrlAuthenticationFailureHandler();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/login") || 
               path.startsWith("/register") || 
               path.equals("/ping") || 
               path.equals("/refresh") ||
               path.startsWith("/h2-console");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Check if the request should be filtered
            if (shouldNotFilter(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = null;
            logger.debug("Processing request for URI: {}", request.getRequestURI());
            
            if (request.getCookies() != null) {
                logger.debug("Cookies found in request: {}", request.getCookies().length);
                for (Cookie cookie : request.getCookies()) {
                    logger.debug("Cookie: {} = {}", cookie.getName(), cookie.getValue());
                    if ("accessToken".equals(cookie.getName())) {
                        token = cookie.getValue();
                        logger.info("Access token found: {}", token);
                        break;
                    }
                }
            } else {
                logger.warn("No cookies found in request");
            }

            if (token == null) {
                logger.warn("No access token found in cookies");
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("Unauthorized: No access token found");
                return;
            }

            if (!jwtUtil.validateToken(token)) {
                logger.warn("Invalid or expired access token: {}", token);
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("Unauthorized: Invalid or expired token");
                return;
            }

            String email = jwtUtil.getEmailFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);
            logger.info("Access token valid. Email: {}, Role: {}", email, role);
            
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    email, null, Collections.singletonList(new SimpleGrantedAuthority(role)));
            SecurityContextHolder.getContext().setAuthentication(auth);
            logger.debug("Authentication set for email: {}", email);

            filterChain.doFilter(request, response);
        } catch (AuthenticationException e) {
            logger.error("Authentication error: {}", e.getMessage());
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during authentication: {}", e.getMessage());
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.getWriter().write("Internal server error during authentication");
        }
    }
}