package com.example.MediLine.Controller.Patient;

import com.example.MediLine.Annotation.CurrentPatient;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorCardDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Service.Patient.PatientHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient/history")
@RequiredArgsConstructor
public class MedicalHistoryController {

    private final PatientHistoryService patientHistoryService;


    @GetMapping("/severity-level-options")
    public ResponseEntity<List<SeverityLevelDTO>> getSeverityLevels() {
        List<SeverityLevelDTO> severityLevels = patientHistoryService.getAllSeverityLevels();

        if(severityLevels.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(severityLevels);
    }

    @GetMapping("/mood-options")
    public ResponseEntity<List<MoodOptionDTO>> getMoodOptions() {
        List<MoodOptionDTO> moodOptions = patientHistoryService.getAllMoodOptions();

        if (moodOptions.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(moodOptions);
    }

    @GetMapping("/get-symptoms")
    public ResponseEntity<List<SymptomDTO>> getAllSymptoms(@CurrentPatient Patient patient) {

        List<SymptomDTO> symptoms =
                patientHistoryService.getAllSymptoms(patient.getPatientId());

        if (symptoms.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(symptoms);
    }

    @PostMapping("/create-symptom")
    public ResponseEntity<String> createSymptom(
            @CurrentPatient Patient patient,
            @RequestBody
            @Valid
            CreateSymptomRequest symptomRequest) {

        patientHistoryService.createSymptom(patient.getPatientId(), symptomRequest);
        return ResponseEntity.ok("Symptom created successfully");
    }


    @GetMapping("/all-medical-tests")
    public ResponseEntity<List<TestSummaryDTO>> getAllMedicalTests(
            @CurrentPatient Patient patient) {

        List<TestSummaryDTO> performedTests =
                patientHistoryService.getAllPerformedTests(patient.getPatientId());

        if (performedTests.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(performedTests);
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
