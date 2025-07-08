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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class HospitalLoginServiceTest {

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private CookieConfig cookieConfig;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private HospitalLoginService hospitalLoginService;

    private HospitalLoginRequest request;
    private Hospital hospital;
    private RefreshToken refreshToken;
    private Cookie accessCookie;
    private Cookie refreshCookie;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        request = new HospitalLoginRequest();
        request.setEmail("hospital@example.com");
        request.setPassword("password123");

        hospital = Hospital.builder()
                .email("hospital@example.com")
                .passwordHash("encodedPassword")
                .name("Apollo Hospital")
                .build();

        refreshToken = new RefreshToken();
        refreshToken.setToken("refreshToken");
        refreshToken.setEmail("hospital@example.com");
        refreshToken.setRole("ROLE_HOSPITAL");
        refreshToken.setExpiryDate(Instant.now().plusMillis(604800000));

        accessCookie = new Cookie("accessToken", "accessToken");
        refreshCookie = new Cookie("refreshToken", "refreshToken");
    }

    @Test
    void testLoginHospitalAndSetCookies_Success() {
        when(hospitalRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(hospital));
        when(passwordEncoder.matches(request.getPassword(), hospital.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateAccessToken(hospital.getEmail(), "ROLE_HOSPITAL")).thenReturn("accessToken");
        when(refreshTokenService.createRefreshToken(hospital.getEmail(), "ROLE_HOSPITAL")).thenReturn(refreshToken);
        when(cookieConfig.createAccessTokenCookie("accessToken")).thenReturn(accessCookie);
        when(cookieConfig.createRefreshTokenCookie("refreshToken")).thenReturn(refreshCookie);

        Hospital result = hospitalLoginService.loginHospitalAndSetCookies(request, response);

        assertNotNull(result);
        assertEquals(hospital.getEmail(), result.getEmail());
        verify(response, times(1)).addCookie(accessCookie);
        verify(response, times(1)).addCookie(refreshCookie);
        verify(refreshTokenService, times(1)).createRefreshToken(hospital.getEmail(), "ROLE_HOSPITAL");
    }

    @Test
    void testLoginHospitalAndSetCookies_InvalidEmail() {
        when(hospitalRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            hospitalLoginService.loginHospitalAndSetCookies(request, response);
        });

        assertEquals("No medical center found with this email.", exception.getMessage());
        verify(response, never()).addCookie(any(Cookie.class));
    }

    @Test
    void testLoginHospitalAndSetCookies_InvalidPassword() {
        when(hospitalRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(hospital));
        when(passwordEncoder.matches(request.getPassword(), hospital.getPasswordHash())).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            hospitalLoginService.loginHospitalAndSetCookies(request, response);
        });

        assertEquals("Invalid password.", exception.getMessage());
        verify(response, never()).addCookie(any(Cookie.class));
    }
}