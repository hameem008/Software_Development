package com.example.MediLine.Service;

import com.example.MediLine.DTO.RefreshToken;
import com.example.MediLine.Repository.RefreshTokenRepository;
import com.example.MediLine.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public RefreshToken createRefreshToken(String email, String role) {
        refreshTokenRepository.deleteByEmailAndRole(email, role); // Remove existing tokens for user

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setEmail(email);
        refreshToken.setRole(role);
        refreshToken.setToken(jwtUtil.generateRefreshToken(email, role));
        refreshToken.setExpiryDate(Instant.now().plusMillis(604800000)); // 7 days
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public void deleteByEmailAndRole(String email, String role) {
        refreshTokenRepository.deleteByEmailAndRole(email, role);
    }

    public boolean validateRefreshToken(String token) {
        Optional<RefreshToken> refreshToken = findByToken(token);
        if (refreshToken.isPresent() && refreshToken.get().getExpiryDate().isAfter(Instant.now())) {
            return jwtUtil.validateToken(token);
        }
        return false;
    }

    @Transactional
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
    }
}