package com.example.MediLine.Controller.Doctor;

import com.example.MediLine.DTO.DoctorDegreeDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.CreateSymptomRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/doctor/add-prescription")
@RequiredArgsConstructor
public class PrescriptionController {


     @PostMapping()
     public ResponseEntity<String> addPrescription(
             @RequestBody
             @Valid
             CreateSymptomRequest prescriptionRequest) {


         return ResponseEntity.ok("Prescription added successfully");
     }
}
