package com.example.MediLine.Controller.Patient;

import com.example.MediLine.Annotation.CurrentPatient;
import com.example.MediLine.DTO.PatientAuthDTO.PatientDashboardDTO;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.DTO.PatientAuthDTO.PatientProfileDTO;
import com.example.MediLine.Repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class PatientProfileController {

    private final PatientRepository patientRepository;


    @GetMapping("/patient/dashboard")
    public ResponseEntity<PatientDashboardDTO> getPatientDashBoard(
            @CurrentPatient Patient patient) {

        return ResponseEntity.ok(null);
    }


    @GetMapping("/patient/profile")
    public ResponseEntity getPatientProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Patient patient = patientRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("No Patient found with this email."));
            PatientProfileDTO responseBody = new PatientProfileDTO(
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
    public ResponseEntity<String> updatePatientProfile(@RequestBody PatientProfileDTO patientProfileData){
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
