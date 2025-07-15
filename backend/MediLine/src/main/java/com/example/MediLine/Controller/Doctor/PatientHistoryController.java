package com.example.MediLine.Controller.Doctor;

import com.example.MediLine.Annotation.CurrentPatient;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.Patient;
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
            @Valid PrescriptionRequest prescriptionRequest) {


        PrescriptionDTO prescriptionDTO =
                patientHistoryService
                    .getPrescriptionDetails(
                        prescriptionRequest.getPrescriptionId(), patient.getPatientId());

        if (prescriptionDTO == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(prescriptionDTO);
    }

    @GetMapping("/all-tests")
    public ResponseEntity<List<TestSummaryDTO>> getAllTests(
            @RequestBody
            @Valid
            PatientHistoryRequest patientRequest) {

        List<TestSummaryDTO> performedTests =
                patientHistoryService.getAllPerformedTests(patient.getPatientId());

        if (performedTests.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(performedTests);


    }

    @PostMapping("/test-result")
    public ResponseEntity<TestResultDTO> getTestResult(
             @RequestBody
             @Valid
             TestResultRequest testResultRequest) {

         TestResultDTO testResults =
                patientHistoryService.getTestResult(
                        testResultRequest.getPerformedTestId(), patient.getPatientId());

        if (testResults == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(testResults);
    }
}
