package com.example.MediLine.Service;

import com.example.MediLine.DTO.Doctor;
import com.example.MediLine.DTO.DoctorRegisterRequest;
import com.example.MediLine.Repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DoctorRegisterService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Doctor registerDoctor(DoctorRegisterRequest request) {
        // Check if email or phone number already exists
        if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use.");
        }
        if (doctorRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number is already in use.");
        }

        // Create Doctor entity
        Doctor doctor = Doctor.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .specialization(request.getSpecialization())
                .designation(request.getDesignation())
                .academicInstitution(request.getAcademicInstitution())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();

        // Save to database
        return doctorRepository.save(doctor);
    }
}
