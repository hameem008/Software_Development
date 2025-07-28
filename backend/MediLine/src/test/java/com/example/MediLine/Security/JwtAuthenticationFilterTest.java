package com.example.MediLine.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JwtAuthenticationFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private StringWriter responseWriter;
    private PrintWriter printWriter;

    @BeforeEach
    public void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();

        // Setup response writer for testing response content
        responseWriter = new StringWriter();
        printWriter = new PrintWriter(responseWriter);
        when(response.getWriter()).thenReturn(printWriter);
    }

    @Test
    void testDoFilterInternal_ValidToken() throws ServletException, IOException {
        String token = "validToken";
        String email = "test@example.com";
        String role = "ROLE_USER";
        Cookie[] cookies = new Cookie[]{new Cookie("accessToken", token)};

        when(request.getCookies()).thenReturn(cookies);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(token)).thenReturn(email);
        when(jwtUtil.getRoleFromToken(token)).thenReturn(role);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
        verify(jwtUtil, times(1)).validateToken(token);
        verify(jwtUtil, times(1)).getEmailFromToken(token);
        verify(jwtUtil, times(1)).getRoleFromToken(token);

        // Verify authentication is set
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals(email, auth.getName());
        assertEquals(role, auth.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void testDoFilterInternal_NoCookies() throws ServletException, IOException {
        when(request.getCookies()).thenReturn(null);
        when(request.getRequestURI()).thenReturn("/api/test");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, never()).doFilter(request, response);
        verify(jwtUtil, never()).validateToken(anyString());
        verify(response, times(1)).setStatus(401);

        printWriter.flush();
        assertTrue(responseWriter.toString().contains("Unauthorized: No access token found"));
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testDoFilterInternal_NoAccessTokenCookie() throws ServletException, IOException {
        Cookie[] cookies = new Cookie[]{new Cookie("otherCookie", "value")};
        when(request.getCookies()).thenReturn(cookies);
        when(request.getRequestURI()).thenReturn("/api/test");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, never()).doFilter(request, response);
        verify(jwtUtil, never()).validateToken(anyString());
        verify(response, times(1)).setStatus(401);

        printWriter.flush();
        assertTrue(responseWriter.toString().contains("Unauthorized: No access token found"));
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testDoFilterInternal_InvalidToken() throws ServletException, IOException {
        String token = "invalidToken";
        Cookie[] cookies = new Cookie[]{new Cookie("accessToken", token)};
        when(request.getCookies()).thenReturn(cookies);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtil.validateToken(token)).thenReturn(false);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, never()).doFilter(request, response);
        verify(jwtUtil, times(1)).validateToken(token);
        verify(jwtUtil, never()).getEmailFromToken(anyString());
        verify(jwtUtil, never()).getRoleFromToken(anyString());
        verify(response, times(1)).setStatus(401);

        printWriter.flush();
        assertTrue(responseWriter.toString().contains("Unauthorized: Invalid or expired token"));
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testDoFilterInternal_ShouldNotFilterPaths() throws ServletException, IOException {
        // Test different paths that should not be filtered
        String[] pathsToTest = {
                "/swagger-ui/index.html",
                "/v3/api-docs/swagger-config",
                "/swagger-resources/configuration/ui",
                "/webjars/swagger-ui/index.html",
                "/ping",
                "/register",
                "/login",
                "/refresh"
        };

        for (String path : pathsToTest) {
            // Reset mocks for each iteration
            reset(request, response, filterChain);
            when(request.getRequestURI()).thenReturn(path);

            jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

            verify(filterChain, times(1)).doFilter(request, response);
            verify(jwtUtil, never()).validateToken(anyString());
        }
    }

    @Test
    void testDoFilterInternal_ExceptionHandling() throws ServletException, IOException {
        String token = "validToken";
        Cookie[] cookies = new Cookie[]{new Cookie("accessToken", token)};

        when(request.getCookies()).thenReturn(cookies);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtil.validateToken(token)).thenThrow(new RuntimeException("JWT parsing error"));

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, never()).doFilter(request, response);
        verify(response, times(1)).setStatus(500);

        printWriter.flush();
        assertTrue(responseWriter.toString().contains("Internal server error during authentication"));
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}