package com.example.MediLine.Controller.Doctor;

import com.example.MediLine.Annotation.CurrentDoctor;
import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.CreatePrescriptionRequest;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Service.Doctor.AddPrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/prescription")
@RequiredArgsConstructor
public class PrescriptionController {
    private final AddPrescriptionService addPrescriptionService;


     @PostMapping("/add")
     public ResponseEntity<String> addPrescription(
             @RequestBody @Valid
             CreatePrescriptionRequest prescriptionRequest,
             @CurrentDoctor Doctor doctor) {

         addPrescriptionService.createPrescription(
                 prescriptionRequest, doctor.getDoctorId());


         return ResponseEntity.ok("Prescription added successfully");
     }

     @GetMapping("/all-medicines")
     public ResponseEntity<List<IdNameDTO>> getAllMedicines() {

         List<IdNameDTO> allMedicinesNames = addPrescriptionService.getAllMedicineNames();

         if(allMedicinesNames.isEmpty())
             return ResponseEntity.noContent().build();

         return ResponseEntity.ok(allMedicinesNames);
     }

     @GetMapping("/all-diseases")
     public ResponseEntity<List<IdNameDTO>> getAllDiseases() {

         List<IdNameDTO> allDiseaseNames = addPrescriptionService.getAllDiseaseNames();

         if(allDiseaseNames.isEmpty())
             return ResponseEntity.noContent().build();

         return ResponseEntity.ok(allDiseaseNames);
     }

     @GetMapping("/all-tests")
     public ResponseEntity<List<IdNameDTO>> getAllTests() {

         List<IdNameDTO> allTestNames = addPrescriptionService.getAllTestNames();

         if(allTestNames.isEmpty())
             return ResponseEntity.noContent().build();

         return ResponseEntity.ok(allTestNames);
     }
}
