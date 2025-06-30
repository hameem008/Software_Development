package com.example.MediLine.Controller.Doctor;

import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/patient-history")
@RequiredArgsConstructor
public class PatientHistoryController {

    @PostMapping("/prescription-details")
    public ResponseEntity<PrescriptionDTO> getPrescriptionDetails(
             @RequestBody
             @Valid
             PrescriptionRequest prescriptionRequest) {


         return ResponseEntity.ok(null);
    }

    @GetMapping("/all-tests")
    public ResponseEntity<List<TestSummaryDTO>> getAllTests(
            @RequestBody
            @Valid
            PatientHistoryRequest patientRequest) {

         return ResponseEntity.ok(null);
    }

    @PostMapping("/test-result")
    public ResponseEntity<TestResultDTO> getTestResult(
             @RequestBody
             @Valid
             TestResultRequest testResultRequest) {

         return ResponseEntity.ok(null);
    }
}
