package com.example.MediLine.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.MediLine.Config.CookieConfig;
import com.example.MediLine.DTO.Doctor;
import com.example.MediLine.DTO.DoctorLoginRequest;
import com.example.MediLine.DTO.RefreshToken;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Security.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;


@Service
public class DoctorLoginService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private CookieConfig cookieConfig;

    public Doctor loginDoctorAndSetCookies(DoctorLoginRequest request, HttpServletResponse response) {
        Doctor doctor = doctorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No doctor found with this email."));

        if (!passwordEncoder.matches(request.getPassword(), doctor.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password.");
        }

        String accessToken = jwtUtil.generateAccessToken(doctor.getEmail(), "ROLE_DOCTOR");
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(doctor.getEmail(), "ROLE_DOCTOR");

        Cookie accessCookie = cookieConfig.createAccessTokenCookie(accessToken);
        Cookie refreshCookie = cookieConfig.createRefreshTokenCookie(refreshToken.getToken());

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        return doctor;
    }
}