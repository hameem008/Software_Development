package com.example.MediLine.Service.Patient;

import com.example.MediLine.DTO.PatientAuthDTO.PatientRegisterRequest;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PatientRegisterServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PatientRegisterService patientRegisterService;

    private PatientRegisterRequest request;
    private Patient patient;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        request = PatientRegisterRequest.builder()
                .email("patient@example.com")
                .password("password123")
                .firstName("John")
                .lastName("Doe")
                .gender("Male")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .bloodGroup("A+")
                .phoneNumber("1234567890")
                .address("123 Main St")
                .build();

        patient = Patient.builder()
                .email(request.getEmail())
                .passwordHash("encodedPassword")
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .bloodGroup(request.getBloodGroup())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();
    }

    @Test
    void testRegisterPatient_Success() {
        when(patientRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(patientRepository.findByPhoneNumber(request.getPhoneNumber())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(patientRepository.save(any(Patient.class))).thenReturn(patient);

        Patient result = patientRegisterService.registerPatient(request);

        assertNotNull(result);
        assertEquals(request.getEmail(), result.getEmail());
        assertEquals(request.getFirstName(), result.getFirstName());
        assertEquals("encodedPassword", result.getPasswordHash());
        verify(patientRepository, times(1)).save(any(Patient.class));
    }

    @Test
    void testRegisterPatient_EmailAlreadyInUse() {
        when(patientRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(patient));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            patientRegisterService.registerPatient(request);
        });

        assertEquals("Email already in use", exception.getMessage());
        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    void testRegisterPatient_PhoneNumberAlreadyInUse() {
        when(patientRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(patientRepository.findByPhoneNumber(request.getPhoneNumber())).thenReturn(Optional.of(patient));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            patientRegisterService.registerPatient(request);
        });

        assertEquals("Phone number already in use", exception.getMessage());
        verify(patientRepository, never()).save(any(Patient.class));
    }
}