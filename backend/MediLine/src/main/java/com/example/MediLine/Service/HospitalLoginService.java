package com.example.MediLine.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.MediLine.Config.CookieConfig;
import com.example.MediLine.DTO.Hospital;
import com.example.MediLine.DTO.HospitalLoginRequest;
import com.example.MediLine.DTO.RefreshToken;
import com.example.MediLine.Repository.HospitalRepository;
import com.example.MediLine.Security.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class HospitalLoginService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private CookieConfig cookieConfig;

    public Hospital loginHospitalAndSetCookies(HospitalLoginRequest request, HttpServletResponse response) {
        Hospital hospital = hospitalRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No hospital found with this email."));

        if (!passwordEncoder.matches(request.getPassword(), hospital.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password.");
        }

        String accessToken = jwtUtil.generateAccessToken(hospital.getEmail(), "ROLE_HOSPITAL");
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(hospital.getEmail(), "ROLE_HOSPITAL");

        Cookie accessCookie = cookieConfig.createAccessTokenCookie(accessToken);
        Cookie refreshCookie = cookieConfig.createRefreshTokenCookie(refreshToken.getToken());

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        return hospital;
    }
}