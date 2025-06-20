package com.example.MediLine.Service;

import com.example.MediLine.DTO.Patient;
import com.example.MediLine.DTO.PatientRegisterRequest;
import com.example.MediLine.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientRegisterService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Patient registerPatient(PatientRegisterRequest request) {
        // Check if email or phone number already exists
        if (patientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (patientRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number already in use");
        }

        // Create and save patient
        Patient patient = Patient.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .bloodGroup(request.getBloodGroup())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();

        return patientRepository.save(patient);
    }
}
