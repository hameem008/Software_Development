package com.example.MediLine.Controller;

import com.example.MediLine.DTO.*;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Repository.HospitalRepository;
import com.example.MediLine.Repository.PatientRepository;
import com.example.MediLine.Service.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class AuthenticationController {

    @Autowired
    private PatientRegisterService patientRegisterService;

    @Autowired
    private PatientLoginService patientLoginService;

    @Autowired
    private DoctorRegisterService doctorRegisterService;

    @Autowired
    private DoctorLoginService doctorLoginService;

    @Autowired
    private HospitalRegisterService hospitalRegisterService;

    @Autowired
    private HospitalLoginService hospitalLoginService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @GetMapping("/ping")
    public String ping() {
        return "Pong 🏓 - Server is alive! Mewo Mewo!";
    }

    @PostMapping("/register/patient")
    public ResponseEntity registerPatient(@RequestBody PatientRegisterRequest request) {
        Patient registeredPatient = patientRegisterService.registerPatient(request);
        return ResponseEntity.ok(registeredPatient);
    }

    @PostMapping("/register/doctor")
    public ResponseEntity registerDoctor(@RequestBody DoctorRegisterRequest request) {
        Doctor registeredDoctor = doctorRegisterService.registerDoctor(request);
        return ResponseEntity.ok(registeredDoctor);
    }

    @PostMapping("/register/hospital")
    public ResponseEntity registerHospital(@RequestBody HospitalRegisterRequest request) {
        Hospital registeredHospital = hospitalRegisterService.registerHospital(request);
        return ResponseEntity.ok(registeredHospital);
    }

    @PostMapping("/login/patient")
    public ResponseEntity loginPatient(@RequestBody PatientLoginRequest request, HttpServletResponse response) {
        Patient patient = patientLoginService.loginPatientAndSetCookies(request, response);
        User responseBody = new User();
        responseBody.setId(patient.getPatientId().toString());
        responseBody.setName(patient.getFirstName() + " " + patient.getLastName());
        responseBody.setEmail(patient.getEmail());
        responseBody.setType("patient");
        responseBody.setAvatar(patient.getProfilePhotoUrl());
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/login/doctor")
    public ResponseEntity loginDoctor(@RequestBody DoctorLoginRequest request, HttpServletResponse response) {
        Doctor doctor = doctorLoginService.loginDoctorAndSetCookies(request, response);
        User responseBody = new User();
        responseBody.setId(doctor.getDoctorId().toString());
        responseBody.setName(doctor.getFirstName() + " " + doctor.getLastName());
        responseBody.setEmail(doctor.getEmail());
        responseBody.setType("doctor");
        responseBody.setAvatar(doctor.getProfilePhotoUrl());
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/login/hospital")
    public ResponseEntity loginHospital(@RequestBody HospitalLoginRequest request, HttpServletResponse response) {
        Hospital hospital = hospitalLoginService.loginHospitalAndSetCookies(request, response);
        User responseBody = new User();
        responseBody.setId(hospital.getHospitalId().toString());
        responseBody.setName(hospital.getName());
        responseBody.setEmail(hospital.getEmail());
        responseBody.setType("hospital");
        responseBody.setAvatar(hospital.getProfilePhotoUrl());
        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/me")
    public ResponseEntity getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            String roles = authentication.getAuthorities().toString();
            User responseBody = new User();
            if (roles.equals("[ROLE_PATIENT]")) {
                Patient patient = patientRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("No Patient found with this email."));
                responseBody.setId(patient.getPatientId().toString());
                responseBody.setName(patient.getFirstName() + " " + patient.getLastName());
                responseBody.setEmail(patient.getEmail());
                responseBody.setType("patient");
                responseBody.setAvatar(patient.getProfilePhotoUrl());
            } else if (roles.equals("[ROLE_DOCTOR]")) {
                Doctor doctor = doctorRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("No Doctor found with this email."));
                responseBody.setId(doctor.getDoctorId().toString());
                responseBody.setName(doctor.getFirstName() + " " + doctor.getLastName());
                responseBody.setEmail(doctor.getEmail());
                responseBody.setType("doctor");
                responseBody.setAvatar(doctor.getProfilePhotoUrl());
            } else if (roles.equals("[ROLE_HOSPITAL]")) {
                Hospital hospital = hospitalRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("No Hospital found with this email."));
                responseBody.setId(hospital.getHospitalId().toString());
                responseBody.setName(hospital.getName());
                responseBody.setEmail(hospital.getEmail());
                responseBody.setType("hospital");
                responseBody.setAvatar(hospital.getProfilePhotoUrl());
            }
            System.out.println(responseBody);
            return ResponseEntity.ok(responseBody);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
    }

    @GetMapping("/doctor/profile")
    public ResponseEntity<String> getDoctorProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            String roles = authentication.getAuthorities().toString();
            return ResponseEntity.ok("Welcome, " + email + " (Role: " + roles + ")");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
    }

    @GetMapping("/hospital/profile")
    public ResponseEntity<String> getHospitalProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            String roles = authentication.getAuthorities().toString();
            return ResponseEntity.ok("Welcome, " + email + " (Role: " + roles + ")");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
    }
}