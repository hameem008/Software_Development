package com.example.MediLine.Controller.Patient;

import com.example.MediLine.DTO.FindDoctorDTO.*;
import com.example.MediLine.Repository.DoctorAvailabilityRepository;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Service.Patient.FindDoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class FindDoctorController {

    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityRepository doctorAvailabilityRepository;
    private final FindDoctorService findDoctorService;

    @PostMapping("/find-doctors")
    public ResponseEntity<List<DoctorCardDTO>> findDoctors(
            @RequestBody FindDoctorRequest doctorRequest) {

        List<DoctorCardDTO> doctors = findDoctorService.searchDoctors(doctorRequest);

        if (doctors.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(doctors);

    }

    @PostMapping("/find-doctors/by-name")
    public ResponseEntity<List<DoctorCardDTO>> findDoctorsByName(
            @RequestBody FindDoctorRequest doctorRequest) {

        List<DoctorCardDTO> doctors = findDoctorService.searchDoctorsByName(doctorRequest);

        if (doctors.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(doctors);

    }

    @GetMapping("/specialties")
    public ResponseEntity<List<String>> getAllSpecialties() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(doctorRepository.findAllDistinctSpecialties());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList());

    }

    @GetMapping("/locations")
    public ResponseEntity<List<String>> getAllLocations() {
        List<String> locations =
                doctorAvailabilityRepository.findAllDistinctDoctorLocations();

        if (locations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(locations);
    }

    @PostMapping("/find-doctors/details")
    public ResponseEntity<DoctorDetailsDTO> getDoctorDetails(
            @RequestBody DoctorRequest doctorRequest) {

        DoctorDetailsDTO details = findDoctorService.getDoctorDetails(doctorRequest.getDoctorId());
        return ResponseEntity.ok(details);
    }

    @PostMapping("/find-doctors/details/reviews")
    public ResponseEntity<List<DoctorReviewDTO>> getDoctorReviews(
            @RequestBody DoctorRequest doctorRequest) {

        List<DoctorReviewDTO> reviews = findDoctorService.getDoctorReviews(doctorRequest.getDoctorId());

        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(reviews);
    }
}
