package com.example.MediLine.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.MediLine.Config.CookieConfig;
import com.example.MediLine.DTO.MedicalCenter;
import com.example.MediLine.DTO.MedicalCenterLoginRequest;
import com.example.MediLine.DTO.RefreshToken;
import com.example.MediLine.Repository.MedicalCenterRepository;
import com.example.MediLine.Security.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;



@Service
public class MedicalCenterLoginService {

    @Autowired
    private MedicalCenterRepository medicalCenterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private CookieConfig cookieConfig;

    public MedicalCenter loginMedicalCenterAndSetCookies(MedicalCenterLoginRequest request, HttpServletResponse response) {
        MedicalCenter medicalCenter = medicalCenterRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No medical center found with this email."));

        if (!passwordEncoder.matches(request.getPassword(), medicalCenter.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password.");
        }

        String accessToken = jwtUtil.generateAccessToken(medicalCenter.getEmail(), "ROLE_MEDICAL_CENTER");
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(medicalCenter.getEmail(), "ROLE_MEDICAL_CENTER");

        Cookie accessCookie = cookieConfig.createAccessTokenCookie(accessToken);
        Cookie refreshCookie = cookieConfig.createRefreshTokenCookie(refreshToken.getToken());

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        return medicalCenter;
    }
}