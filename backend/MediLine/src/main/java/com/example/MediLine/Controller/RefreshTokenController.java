package com.example.MediLine.Controller;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MediLine.Config.CookieConfig;
import com.example.MediLine.DTO.RefreshToken;
import com.example.MediLine.Security.JwtUtil;
import com.example.MediLine.Service.RefreshTokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/refresh")
public class RefreshTokenController {

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieConfig cookieConfig;

    @GetMapping
    public ResponseEntity refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = Arrays.stream(request.getCookies())
                .filter(cookie -> "refreshToken".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (refreshToken == null || !refreshTokenService.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid or expired refresh token");
        }

        RefreshToken token = refreshTokenService.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        String email = jwtUtil.getEmailFromToken(refreshToken);
        String role = jwtUtil.getRoleFromToken(refreshToken);
        String newAccessToken = jwtUtil.generateAccessToken(email, role);

        Cookie accessCookie = cookieConfig.createAccessTokenCookie(newAccessToken);
        response.addCookie(accessCookie);

        return ResponseEntity.ok().build();
    }
}