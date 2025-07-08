package com.example.MediLine.Service.Doctor;

import com.example.MediLine.DTO.DoctorAuthDTO.DoctorRegisterRequest;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Repository.DoctorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DoctorRegisterServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private DoctorRegisterService doctorRegisterService;

    private DoctorRegisterRequest request;
    private Doctor doctor;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        request = DoctorRegisterRequest.builder()
                .email("doctor@example.com")
                .password("password123")
                .firstName("Jane")
                .lastName("Smith")
                .gender("Female")
                .specialization("Cardiology")
                .designation("Professor")
                .academicInstitution("BSMMU")
                .phoneNumber("9876543210")
                .address("456 Main St")
                .build();

        doctor = Doctor.builder()
                .email(request.getEmail())
                .passwordHash("encodedPassword")
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .specialization(request.getSpecialization())
                .designation(request.getDesignation())
                .academicInstitution(request.getAcademicInstitution())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();
    }

    @Test
    void testRegisterDoctor_Success() {
        when(doctorRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(doctorRepository.findByPhoneNumber(request.getPhoneNumber())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(doctorRepository.save(any(Doctor.class))).thenReturn(doctor);

        Doctor result = doctorRegisterService.registerDoctor(request);

        assertNotNull(result);
        assertEquals(request.getEmail(), result.getEmail());
        assertEquals(request.getFirstName(), result.getFirstName());
        assertEquals("encodedPassword", result.getPasswordHash());
        verify(doctorRepository, times(1)).save(any(Doctor.class));
    }

    @Test
    void testRegisterDoctor_EmailAlreadyInUse() {
        when(doctorRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(doctor));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorRegisterService.registerDoctor(request);
        });

        assertEquals("Email is already in use.", exception.getMessage());
        verify(doctorRepository, never()).save(any(Doctor.class));
    }

    @Test
    void testRegisterDoctor_PhoneNumberAlreadyInUse() {
        when(doctorRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(doctorRepository.findByPhoneNumber(request.getPhoneNumber())).thenReturn(Optional.of(doctor));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorRegisterService.registerDoctor(request);
        });

        assertEquals("Phone number is already in use.", exception.getMessage());
        verify(doctorRepository, never()).save(any(Doctor.class));
    }
}