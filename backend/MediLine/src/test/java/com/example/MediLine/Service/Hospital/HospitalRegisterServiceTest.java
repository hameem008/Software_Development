package com.example.MediLine.Service.Hospital;

import com.example.MediLine.DTO.HospitalDTO.HospitalRegisterRequest;
import com.example.MediLine.Entity.Hospital;
import com.example.MediLine.Repository.HospitalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class HospitalRegisterServiceTest {

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private HospitalRegisterService hospitalRegisterService;

    private HospitalRegisterRequest request;
    private Hospital hospital;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        request = HospitalRegisterRequest.builder()
                .email("hospital@example.com")
                .password("password123")
                .name("Apollo Hospital")
                .description("A leading hospital")
                .phoneNumber("1231231234")
                .address("789 Main St")
                .build();

        hospital = Hospital.builder()
                .email(request.getEmail())
                .passwordHash("encodedPassword")
                .name(request.getName())
                .description(request.getDescription())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();
    }

    @Test
    void testRegisterHospital_Success() {
        when(hospitalRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(hospitalRepository.findByPhoneNumber(request.getPhoneNumber())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(hospitalRepository.save(any(Hospital.class))).thenReturn(hospital);

        Hospital result = hospitalRegisterService.registerHospital(request);

        assertNotNull(result);
        assertEquals(request.getEmail(), result.getEmail());
        assertEquals(request.getName(), result.getName());
        assertEquals("encodedPassword", result.getPasswordHash());
        verify(hospitalRepository, times(1)).save(any(Hospital.class));
    }

    @Test
    void testRegisterHospital_EmailAlreadyInUse() {
        when(hospitalRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(hospital));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            hospitalRegisterService.registerHospital(request);
        });

        assertEquals("Email already in use", exception.getMessage());
        verify(hospitalRepository, never()).save(any(Hospital.class));
    }

    @Test
    void testRegisterHospital_PhoneNumberAlreadyInUse() {
        when(hospitalRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(hospitalRepository.findByPhoneNumber(request.getPhoneNumber())).thenReturn(Optional.of(hospital));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            hospitalRegisterService.registerHospital(request);
        });

        assertEquals("Phone number already in use", exception.getMessage());
        verify(hospitalRepository, never()).save(any(Hospital.class));
    }
}