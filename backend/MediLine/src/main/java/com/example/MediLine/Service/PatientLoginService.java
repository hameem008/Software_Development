package com.example.MediLine.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.MediLine.Config.CookieConfig;
import com.example.MediLine.DTO.Patient;
import com.example.MediLine.DTO.PatientLoginRequest;
import com.example.MediLine.DTO.RefreshToken;
import com.example.MediLine.Repository.PatientRepository;
import com.example.MediLine.Security.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;



@Service
public class PatientLoginService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private CookieConfig cookieConfig;

    public Patient loginPatientAndSetCookies(PatientLoginRequest request, HttpServletResponse response) {
        Patient patient = patientRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No patient found with this email."));

        if (!passwordEncoder.matches(request.getPassword(), patient.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password.");
        }

        String accessToken = jwtUtil.generateAccessToken(patient.getEmail(), "ROLE_PATIENT");
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(patient.getEmail(), "ROLE_PATIENT");

        Cookie accessCookie = cookieConfig.createAccessTokenCookie(accessToken);
        Cookie refreshCookie = cookieConfig.createRefreshTokenCookie(refreshToken.getToken());

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        return patient;
    }
}