package com.example.MediLine.Controller.Patient;

import com.example.MediLine.Annotation.CurrentPatient;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.Patient;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient/history")
@RequiredArgsConstructor
public class MedicalHistoryController {

    @GetMapping("/severity-level-options")
    public ResponseEntity<List<SeverityLevelDTO>> getSeverityLevels() {
         return ResponseEntity.ok(null);
    }

    @GetMapping("/mood-options")
    public ResponseEntity<List<MoodOptionDTO>> getMoodOptions() {
         return ResponseEntity.ok(null);
    }

    @GetMapping("/get-symptoms")
    public ResponseEntity<List<SymptomDTO>> getPrescriptionDetails() {


         return ResponseEntity.ok(null);
    }

    @PostMapping("/create-symptom")
    public ResponseEntity<String> getPrescriptionDetails(
             @RequestBody
             @Valid
             CreateSymptomRequest symptomRequest) {


         return ResponseEntity.ok(null);
    }


    @GetMapping("/all-medical-tests")
    public ResponseEntity<List<TestSummaryDTO>> getAllMedicalTests(
            @CurrentPatient Patient patient) {

        return null;
    }

    @GetMapping("/all-requested-tests")
    public ResponseEntity<List<RequestedTestDTO>> getAllRequestedTests(
            @CurrentPatient Patient patient) {

        return null;
    }

    @PostMapping("/test-result")
    public ResponseEntity<List<TestResultDTO>> getTestResult(
            @RequestBody
            @Valid
            TestResultRequest testResultRequest) {

        return null;
    }
}
