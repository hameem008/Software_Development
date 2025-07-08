package com.example.MediLine.Service.Patient;

import com.example.MediLine.Config.CookieConfig;
import com.example.MediLine.DTO.PatientAuthDTO.PatientLoginRequest;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Entity.RefreshToken;
import com.example.MediLine.Repository.PatientRepository;
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

public class PatientLoginServiceTest {

    @Mock
    private PatientRepository patientRepository;

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
    private PatientLoginService patientLoginService;

    private PatientLoginRequest request;
    private Patient patient;
    private RefreshToken refreshToken;
    private Cookie accessCookie;
    private Cookie refreshCookie;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        request = new PatientLoginRequest();
        request.setEmail("patient@example.com");
        request.setPassword("password123");

        patient = Patient.builder()
                .email("patient@example.com")
                .passwordHash("encodedPassword")
                .firstName("John")
                .lastName("Doe")
                .build();

        refreshToken = new RefreshToken();
        refreshToken.setToken("refreshToken");
        refreshToken.setEmail("patient@example.com");
        refreshToken.setRole("ROLE_PATIENT");
        refreshToken.setExpiryDate(Instant.now().plusMillis(604800000));

        accessCookie = new Cookie("accessToken", "accessToken");
        refreshCookie = new Cookie("refreshToken", "refreshToken");
    }

    @Test
    void testLoginPatientAndSetCookies_Success() {
        when(patientRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(patient));
        when(passwordEncoder.matches(request.getPassword(), patient.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateAccessToken(patient.getEmail(), "ROLE_PATIENT")).thenReturn("accessToken");
        when(refreshTokenService.createRefreshToken(patient.getEmail(), "ROLE_PATIENT")).thenReturn(refreshToken);
        when(cookieConfig.createAccessTokenCookie("accessToken")).thenReturn(accessCookie);
        when(cookieConfig.createRefreshTokenCookie("refreshToken")).thenReturn(refreshCookie);

        Patient result = patientLoginService.loginPatientAndSetCookies(request, response);

        assertNotNull(result);
        assertEquals(patient.getEmail(), result.getEmail());
        verify(response, times(1)).addCookie(accessCookie);
        verify(response, times(1)).addCookie(refreshCookie);
        verify(refreshTokenService, times(1)).createRefreshToken(patient.getEmail(), "ROLE_PATIENT");
    }

    @Test
    void testLoginPatientAndSetCookies_InvalidEmail() {
        when(patientRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            patientLoginService.loginPatientAndSetCookies(request, response);
        });

        assertEquals("No patient found with this email.", exception.getMessage());
        verify(response, never()).addCookie(any(Cookie.class));
    }

    @Test
    void testLoginPatientAndSetCookies_InvalidPassword() {
        when(patientRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(patient));
        when(passwordEncoder.matches(request.getPassword(), patient.getPasswordHash())).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            patientLoginService.loginPatientAndSetCookies(request, response);
        });

        assertEquals("Invalid password.", exception.getMessage());
        verify(response, never()).addCookie(any(Cookie.class));
    }
}