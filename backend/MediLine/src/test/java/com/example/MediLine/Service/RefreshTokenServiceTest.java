package com.example.MediLine.Service;

import com.example.MediLine.Entity.RefreshToken;
import com.example.MediLine.Repository.RefreshTokenRepository;
import com.example.MediLine.Security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private final String email = "test@example.com";
    private final String role = "ROLE_PATIENT";
    private final String token = "sample-refresh-token";
    private final Instant expiryDate = Instant.now().plusMillis(604800000); // 7 days

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @Transactional
    void testCreateRefreshToken_success() {
        // Arrange
        RefreshToken expectedToken = new RefreshToken();
        expectedToken.setEmail(email);
        expectedToken.setRole(role);
        expectedToken.setToken(token);
        expectedToken.setExpiryDate(expiryDate);

        when(jwtUtil.generateRefreshToken(email, role)).thenReturn(token);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(expectedToken);

        // Act
        RefreshToken result = refreshTokenService.createRefreshToken(email, role);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        assertEquals(role, result.getRole());
        assertEquals(token, result.getToken());
        assertEquals(expiryDate, result.getExpiryDate());
        verify(refreshTokenRepository, times(1)).deleteByEmailAndRole(email, role);
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    void testFindByToken_success() {
        // Arrange
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(token);
        refreshToken.setEmail(email);
        refreshToken.setRole(role);
        refreshToken.setExpiryDate(expiryDate);

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(refreshToken));

        // Act
        Optional<RefreshToken> result = refreshTokenService.findByToken(token);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(token, result.get().getToken());
        assertEquals(email, result.get().getEmail());
        assertEquals(role, result.get().getRole());
        verify(refreshTokenRepository, times(1)).findByToken(token);
    }

    @Test
    void testFindByToken_notFound() {
        // Arrange
        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.empty());

        // Act
        Optional<RefreshToken> result = refreshTokenService.findByToken(token);

        // Assert
        assertFalse(result.isPresent());
        verify(refreshTokenRepository, times(1)).findByToken(token);
    }

    @Test
    @Transactional
    void testDeleteByEmailAndRole() {
        // Act
        refreshTokenService.deleteByEmailAndRole(email, role);

        // Assert
        verify(refreshTokenRepository, times(1)).deleteByEmailAndRole(email, role);
    }

    @Test
    void testValidateRefreshToken_validToken() {
        // Arrange
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(token);
        refreshToken.setEmail(email);
        refreshToken.setRole(role);
        refreshToken.setExpiryDate(Instant.now().plusMillis(100000)); // Not expired

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(refreshToken));
        when(jwtUtil.validateToken(token)).thenReturn(true);

        // Act
        boolean isValid = refreshTokenService.validateRefreshToken(token);

        // Assert
        assertTrue(isValid);
        verify(refreshTokenRepository, times(1)).findByToken(token);
        verify(jwtUtil, times(1)).validateToken(token);
    }

    @Test
    void testValidateRefreshToken_expiredToken() {
        // Arrange
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(token);
        refreshToken.setEmail(email);
        refreshToken.setRole(role);
        refreshToken.setExpiryDate(Instant.now().minusMillis(100000)); // Expired

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(refreshToken));

        // Act
        boolean isValid = refreshTokenService.validateRefreshToken(token);

        // Assert
        assertFalse(isValid);
        verify(refreshTokenRepository, times(1)).findByToken(token);
        verify(jwtUtil, never()).validateToken(token);
    }

    @Test
    void testValidateRefreshToken_tokenNotFound() {
        // Arrange
        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.empty());

        // Act
        boolean isValid = refreshTokenService.validateRefreshToken(token);

        // Assert
        assertFalse(isValid);
        verify(refreshTokenRepository, times(1)).findByToken(token);
        verify(jwtUtil, never()).validateToken(token);
    }

    @Test
    @Transactional
    void testDeleteExpiredTokens() {
        // Act
        refreshTokenService.deleteExpiredTokens();

        // Assert
        verify(refreshTokenRepository, times(1)).deleteByExpiryDateBefore(any(Instant.class));
    }
}