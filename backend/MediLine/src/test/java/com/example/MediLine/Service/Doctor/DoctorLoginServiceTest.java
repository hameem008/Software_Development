package com.example.MediLine.Service.Doctor;

import com.example.MediLine.Config.CookieConfig;
import com.example.MediLine.DTO.DoctorAuthDTO.DoctorLoginRequest;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Entity.RefreshToken;
import com.example.MediLine.Repository.DoctorRepository;
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

public class DoctorLoginServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

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
    private DoctorLoginService doctorLoginService;

    private DoctorLoginRequest request;
    private Doctor doctor;
    private RefreshToken refreshToken;
    private Cookie accessCookie;
    private Cookie refreshCookie;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        request = new DoctorLoginRequest();
        request.setEmail("doctor@example.com");
        request.setPassword("password123");

        doctor = Doctor.builder()
                .email("doctor@example.com")
                .passwordHash("encodedPassword")
                .firstName("Jane")
                .lastName("Smith")
                .build();

        refreshToken = new RefreshToken();
        refreshToken.setToken("refreshToken");
        refreshToken.setEmail("doctor@example.com");
        refreshToken.setRole("ROLE_DOCTOR");
        refreshToken.setExpiryDate(Instant.now().plusMillis(604800000));

        accessCookie = new Cookie("accessToken", "accessToken");
        refreshCookie = new Cookie("refreshToken", "refreshToken");
    }

    @Test
    void testLoginDoctorAndSetCookies_Success() {
        when(doctorRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(doctor));
        when(passwordEncoder.matches(request.getPassword(), doctor.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateAccessToken(doctor.getEmail(), "ROLE_DOCTOR")).thenReturn("accessToken");
        when(refreshTokenService.createRefreshToken(doctor.getEmail(), "ROLE_DOCTOR")).thenReturn(refreshToken);
        when(cookieConfig.createAccessTokenCookie("accessToken")).thenReturn(accessCookie);
        when(cookieConfig.createRefreshTokenCookie("refreshToken")).thenReturn(refreshCookie);

        Doctor result = doctorLoginService.loginDoctorAndSetCookies(request, response);

        assertNotNull(result);
        assertEquals(doctor.getEmail(), result.getEmail());
        verify(response, times(1)).addCookie(accessCookie);
        verify(response, times(1)).addCookie(refreshCookie);
        verify(refreshTokenService, times(1)).createRefreshToken(doctor.getEmail(), "ROLE_DOCTOR");
    }

    @Test
    void testLoginDoctorAndSetCookies_InvalidEmail() {
        when(doctorRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorLoginService.loginDoctorAndSetCookies(request, response);
        });

        assertEquals("No doctor found with this email.", exception.getMessage());
        verify(response, never()).addCookie(any(Cookie.class));
    }

    @Test
    void testLoginDoctorAndSetCookies_InvalidPassword() {
        when(doctorRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(doctor));
        when(passwordEncoder.matches(request.getPassword(), doctor.getPasswordHash())).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorLoginService.loginDoctorAndSetCookies(request, response);
        });

        assertEquals("Invalid password.", exception.getMessage());
        verify(response, never()).addCookie(any(Cookie.class));
    }
}