package com.example.MediLine.Service;

import com.example.MediLine.DTO.MedicalCenter;
import com.example.MediLine.DTO.MedicalCenterRegisterRequest;
import com.example.MediLine.Repository.MedicalCenterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MedicalCenterRegisterService {

    @Autowired
    private MedicalCenterRepository medicalCenterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public MedicalCenter registerMedicalCenter(MedicalCenterRegisterRequest request) {
        // Check if email or phone number already exists
        if (medicalCenterRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (medicalCenterRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number already in use");
        }

        // Create and save medical center
        MedicalCenter medicalCenter = MedicalCenter.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .description(request.getDescription())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();

        return medicalCenterRepository.save(medicalCenter);
    }
}