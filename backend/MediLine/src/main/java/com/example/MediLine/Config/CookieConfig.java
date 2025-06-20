package com.example.MediLine.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.servlet.http.Cookie;


@Configuration
public class CookieConfig {

    @Value("${cookie.domain:localhost}")
    private String cookieDomain;

    @Value("${cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${cookie.same-site:Strict}")
    private String cookieSameSite;

    public Cookie createAccessTokenCookie(String token) {
        Cookie cookie = new Cookie("accessToken", token);
        configureCookie(cookie, 3600); // 1 hour
        return cookie;
    }

    public Cookie createRefreshTokenCookie(String token) {
        Cookie cookie = new Cookie("refreshToken", token);
        configureCookie(cookie, 7 * 24 * 60 * 60); // 7 days
        return cookie;
    }

    public Cookie createEmptyAccessTokenCookie() {
        Cookie cookie = new Cookie("accessToken", null);
        configureCookie(cookie, 0);
        return cookie;
    }

    public Cookie createEmptyRefreshTokenCookie() {
        Cookie cookie = new Cookie("refreshToken", null);
        configureCookie(cookie, 0);
        return cookie;
    }

    private void configureCookie(Cookie cookie, int maxAge) {
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setDomain(cookieDomain);
        
        // Set SameSite attribute
        String sameSiteValue = cookieSameSite.equals("None") ? "None" : 
                             cookieSameSite.equals("Lax") ? "Lax" : "Strict";
        cookie.setAttribute("SameSite", sameSiteValue);
    }
} 