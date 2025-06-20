package com.example.MediLine.Controller;

import com.example.MediLine.DTO.Patient;
import com.example.MediLine.DTO.PatientProfileData;
import com.example.MediLine.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class PatientProfileController {

    @Autowired
    PatientRepository patientRepository;

    @GetMapping("/patient/profile")
    public ResponseEntity getPatientProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Patient patient = patientRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("No Patient found with this email."));
            PatientProfileData responseBody = new PatientProfileData(
                    patient.getEmail(),
                    patient.getFirstName(),
                    patient.getLastName(),
                    patient.getGender(),
                    patient.getDateOfBirth(),
                    patient.getBloodGroup(),
                    patient.getPhoneNumber(),
                    patient.getAddress(),
                    patient.getProfilePhotoUrl()
            );
            return ResponseEntity.ok(responseBody);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
    }

    @PostMapping("/patient/profile/update")
    public ResponseEntity<String> updatePatientProfile(@RequestBody PatientProfileData patientProfileData){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Patient patient = patientRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("No Patient found with this email."));
            patient.setFirstName(patientProfileData.getFirstName());
            patient.setLastName(patientProfileData.getLastName());
            patient.setGender(patientProfileData.getGender());
            patient.setDateOfBirth(patientProfileData.getDateOfBirth());
            patient.setBloodGroup(patientProfileData.getBloodGroup());
            patient.setPhoneNumber(patientProfileData.getPhoneNumber());
            patient.setAddress(patientProfileData.getAddress());
            patient.setProfilePhotoUrl(patientProfileData.getProfilePhotoUrl());
            patientRepository.save(patient);
            return ResponseEntity.ok("Profile Updated Successfully.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
    }
}
