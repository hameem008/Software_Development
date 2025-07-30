package com.example.MediLine.Controller.Doctor;

import com.example.MediLine.Annotation.CurrentDoctor;
import com.example.MediLine.DTO.DoctorAuthDTO.DoctorProfileDTO;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorDetailsDTO;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Service.Patient.FindDoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class DoctorProfileController {

    private final DoctorRepository doctorRepository;
    private final FindDoctorService findDoctorService;


//    @GetMapping("/doctor/dashboard")
//    public ResponseEntity<DoctorDashboardDTO> getDoctorDashBoard(
//            @CurrentDoctor Doctor doctor) {
//
//        return ResponseEntity.ok(null);
//    }


    @GetMapping("/doctor/profiles")
    public ResponseEntity<DoctorProfileDTO> getDoctorProfiles(@CurrentDoctor Doctor doctor) {
        DoctorProfileDTO responseBody = new DoctorProfileDTO(
                doctor.getEmail(),
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getGender(),
                doctor.getSpecialization(),
                doctor.getDesignation(),
                doctor.getAcademicInstitution(),
                doctor.getPhoneNumber(),
                doctor.getAddress(),
                doctor.getProfilePhotoUrl()
        );
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/doctor/profile/update")
    public ResponseEntity<String> updateDoctorProfile(@RequestBody DoctorProfileDTO doctorProfileData, @CurrentDoctor Doctor doctor) {
        doctor.setFirstName(doctorProfileData.getFirstName());
        doctor.setLastName(doctorProfileData.getLastName());
        doctor.setGender(doctorProfileData.getGender());
        doctor.setPhoneNumber(doctorProfileData.getPhoneNumber());
        doctor.setAddress(doctorProfileData.getAddress());
        doctor.setProfilePhotoUrl(doctorProfileData.getProfilePhotoUrl());
        doctorRepository.save(doctor);
        return ResponseEntity.ok("Profile Updated Successfully.");
    }

    @GetMapping("/doctor/schedule")
    public ResponseEntity<DoctorDetailsDTO> getDoctorSchedule(@CurrentDoctor Doctor doctor) {
            DoctorDetailsDTO doctorDetails = findDoctorService.getDoctorDetails(doctor.getDoctorId());
            return ResponseEntity.ok(doctorDetails);
        }


}
