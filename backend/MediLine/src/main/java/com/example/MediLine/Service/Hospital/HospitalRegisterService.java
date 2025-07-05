package com.example.MediLine.Service.Hospital;

import com.example.MediLine.DTO.HospitalDTO.HospitalRegisterRequest;
import com.example.MediLine.Entity.Hospital;
import com.example.MediLine.Repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class HospitalRegisterService {

    @Autowired
    private HospitalRepository HospitalRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Hospital registerHospital(HospitalRegisterRequest request) {
        // Check if email or phone number already exists
        if (HospitalRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (HospitalRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number already in use");
        }

        // Create and save medical center
        Hospital hospital = Hospital.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .description(request.getDescription())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();

        return HospitalRepository.save(hospital);
    }
}