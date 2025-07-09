package com.example.MediLine.Config;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

public class CookieConfigTest {

    private CookieConfig cookieConfig;

    @BeforeEach
    public void setUp() {
        cookieConfig = new CookieConfig();
        // Set default values for testing
        ReflectionTestUtils.setField(cookieConfig, "cookieDomain", "localhost");
        ReflectionTestUtils.setField(cookieConfig, "cookieSecure", false);
        ReflectionTestUtils.setField(cookieConfig, "cookieSameSite", "Strict");
    }

    @Test
    void testCreateAccessTokenCookie() {
        String token = "access-token-123";

        Cookie cookie = cookieConfig.createAccessTokenCookie(token);

        assertNotNull(cookie);
        assertEquals("accessToken", cookie.getName());
        assertEquals(token, cookie.getValue());
        assertEquals(3600, cookie.getMaxAge()); // 1 hour
        assertEquals("/", cookie.getPath());
        assertEquals("localhost", cookie.getDomain());
        assertTrue(cookie.isHttpOnly());
        assertFalse(cookie.getSecure());
        assertEquals("Strict", cookie.getAttribute("SameSite"));
    }

    @Test
    void testCreateRefreshTokenCookie() {
        String token = "refresh-token-456";

        Cookie cookie = cookieConfig.createRefreshTokenCookie(token);

        assertNotNull(cookie);
        assertEquals("refreshToken", cookie.getName());
        assertEquals(token, cookie.getValue());
        assertEquals(7 * 24 * 60 * 60, cookie.getMaxAge()); // 7 days
        assertEquals("/", cookie.getPath());
        assertEquals("localhost", cookie.getDomain());
        assertTrue(cookie.isHttpOnly());
        assertFalse(cookie.getSecure());
        assertEquals("Strict", cookie.getAttribute("SameSite"));
    }

    @Test
    void testCreateEmptyAccessTokenCookie() {
        Cookie cookie = cookieConfig.createEmptyAccessTokenCookie();

        assertNotNull(cookie);
        assertEquals("accessToken", cookie.getName());
        assertNull(cookie.getValue());
        assertEquals(0, cookie.getMaxAge());
        assertEquals("/", cookie.getPath());
        assertEquals("localhost", cookie.getDomain());
        assertTrue(cookie.isHttpOnly());
        assertFalse(cookie.getSecure());
        assertEquals("Strict", cookie.getAttribute("SameSite"));
    }

    @Test
    void testCreateEmptyRefreshTokenCookie() {
        Cookie cookie = cookieConfig.createEmptyRefreshTokenCookie();

        assertNotNull(cookie);
        assertEquals("refreshToken", cookie.getName());
        assertNull(cookie.getValue());
        assertEquals(0, cookie.getMaxAge());
        assertEquals("/", cookie.getPath());
        assertEquals("localhost", cookie.getDomain());
        assertTrue(cookie.isHttpOnly());
        assertFalse(cookie.getSecure());
        assertEquals("Strict", cookie.getAttribute("SameSite"));
    }

    @Test
    void testConfigureCookie_WithSecureTrue() {
        // Set secure to true
        ReflectionTestUtils.setField(cookieConfig, "cookieSecure", true);

        String token = "test-token";
        Cookie cookie = cookieConfig.createAccessTokenCookie(token);

        assertTrue(cookie.getSecure());
        assertTrue(cookie.isHttpOnly());
        assertEquals("/", cookie.getPath());
        assertEquals("localhost", cookie.getDomain());
    }

    @Test
    void testConfigureCookie_WithDifferentDomain() {
        // Set different domain
        ReflectionTestUtils.setField(cookieConfig, "cookieDomain", "example.com");

        String token = "test-token";
        Cookie cookie = cookieConfig.createAccessTokenCookie(token);

        assertEquals("example.com", cookie.getDomain());
    }

    @Test
    void testConfigureCookie_SameSiteStrict() {
        ReflectionTestUtils.setField(cookieConfig, "cookieSameSite", "Strict");

        String token = "test-token";
        Cookie cookie = cookieConfig.createAccessTokenCookie(token);

        assertEquals("Strict", cookie.getAttribute("SameSite"));
    }

    @Test
    void testConfigureCookie_SameSiteLax() {
        ReflectionTestUtils.setField(cookieConfig, "cookieSameSite", "Lax");

        String token = "test-token";
        Cookie cookie = cookieConfig.createAccessTokenCookie(token);

        assertEquals("Lax", cookie.getAttribute("SameSite"));
    }

    @Test
    void testConfigureCookie_SameSiteNone() {
        ReflectionTestUtils.setField(cookieConfig, "cookieSameSite", "None");

        String token = "test-token";
        Cookie cookie = cookieConfig.createAccessTokenCookie(token);

        assertEquals("None", cookie.getAttribute("SameSite"));
    }

    @Test
    void testConfigureCookie_SameSiteDefault() {
        // Test with invalid SameSite value, should default to Strict
        ReflectionTestUtils.setField(cookieConfig, "cookieSameSite", "Invalid");

        String token = "test-token";
        Cookie cookie = cookieConfig.createAccessTokenCookie(token);

        assertEquals("Strict", cookie.getAttribute("SameSite"));
    }

    @Test
    void testConfigureCookie_AllProperties() {
        // Test with production-like settings
        ReflectionTestUtils.setField(cookieConfig, "cookieDomain", "myapp.com");
        ReflectionTestUtils.setField(cookieConfig, "cookieSecure", true);
        ReflectionTestUtils.setField(cookieConfig, "cookieSameSite", "None");

        String token = "production-token";
        Cookie cookie = cookieConfig.createAccessTokenCookie(token);

        assertEquals("accessToken", cookie.getName());
        assertEquals(token, cookie.getValue());
        assertEquals("myapp.com", cookie.getDomain());
        assertTrue(cookie.getSecure());
        assertTrue(cookie.isHttpOnly());
        assertEquals("/", cookie.getPath());
        assertEquals("None", cookie.getAttribute("SameSite"));
        assertEquals(3600, cookie.getMaxAge());
    }

    @Test
    void testRefreshTokenExpiration() {
        String token = "refresh-token";
        Cookie cookie = cookieConfig.createRefreshTokenCookie(token);

        // Verify 7 days in seconds
        int expectedSeconds = 7 * 24 * 60 * 60;
        assertEquals(expectedSeconds, cookie.getMaxAge());
        assertEquals(604800, cookie.getMaxAge()); // 7 days = 604800 seconds
    }

    @Test
    void testEmptyCookiesForLogout() {
        Cookie accessCookie = cookieConfig.createEmptyAccessTokenCookie();
        Cookie refreshCookie = cookieConfig.createEmptyRefreshTokenCookie();

        // Both should have null values and 0 max age for immediate expiry
        assertNull(accessCookie.getValue());
        assertNull(refreshCookie.getValue());
        assertEquals(0, accessCookie.getMaxAge());
        assertEquals(0, refreshCookie.getMaxAge());

        // But should still have proper security settings
        assertTrue(accessCookie.isHttpOnly());
        assertTrue(refreshCookie.isHttpOnly());
        assertEquals("/", accessCookie.getPath());
        assertEquals("/", refreshCookie.getPath());
    }
}