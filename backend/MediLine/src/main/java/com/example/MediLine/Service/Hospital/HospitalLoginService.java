package com.example.MediLine.Service.Hospital;

import com.example.MediLine.Config.CookieConfig;
import com.example.MediLine.DTO.HospitalDTO.HospitalLoginRequest;
import com.example.MediLine.Entity.Hospital;
import com.example.MediLine.Entity.RefreshToken;
import com.example.MediLine.Repository.HospitalRepository;
import com.example.MediLine.Security.JwtUtil;
import com.example.MediLine.Service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



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
                .orElseThrow(() -> new IllegalArgumentException("No medical center found with this email."));

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