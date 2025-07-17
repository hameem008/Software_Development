package com.example.MediLine.Controller.Doctor;

import com.example.MediLine.Annotation.CurrentDoctor;
import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Service.Doctor.DoctorMedicalHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/patient-history")
@RequiredArgsConstructor
public class DoctorMedicalHistoryController {

    private final DoctorMedicalHistoryService doctorMedicalHistoryService;


    @GetMapping("/prescription/disease-names")
    public ResponseEntity<List<IdNameDTO>> getAllDiseaseNames(
            @RequestBody PatientHistoryRequest patientRequest,
            @CurrentDoctor Doctor doctor) {

        List<IdNameDTO> diseasesNames =
                doctorMedicalHistoryService.getPatientsDiseaseNames(
                        patientRequest.getPatientId(),
                        doctor.getDoctorId()
                );

        if (diseasesNames.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(diseasesNames);
    }

    @GetMapping("/prescription/doctor-names")
    public ResponseEntity<List<IdNameDTO>> getAllPrescriptionDoctorNames(
            @RequestBody PatientHistoryRequest patientRequest,
            @CurrentDoctor Doctor doctor) {

        List<IdNameDTO> doctorNames =
                doctorMedicalHistoryService.getPatientsDoctorNames(
                        patientRequest.getPatientId(),
                        doctor.getDoctorId()
                );

        if (doctorNames.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(doctorNames);
    }


    @PostMapping("/prescription/all")
    public ResponseEntity<List<PrescriptionSummaryDTO>> getAllPrescriptions(
            @RequestBody
            @Valid DoctorPrescriptionListRequest prescriptionRequest,
            @CurrentDoctor Doctor doctor) {


        List<PrescriptionSummaryDTO> prescriptionDetails = doctorMedicalHistoryService
                .getPatientsAllPrescriptions(
                        prescriptionRequest,
                        doctor.getDoctorId()
                );

        if (prescriptionDetails == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(prescriptionDetails);
    }

    @PostMapping("/prescription/details")
    public ResponseEntity<PrescriptionDTO> getPrescriptionDetails(
            @RequestBody
            @Valid PrescriptionRequest prescriptionRequest,
            @CurrentDoctor Doctor doctor) {


        PrescriptionDTO prescriptionDetails =
                doctorMedicalHistoryService
                        .getPatientsPrescription(
                                prescriptionRequest.getPrescriptionId(),
                                doctor.getDoctorId());

        if (prescriptionDetails == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(prescriptionDetails);
    }

    @GetMapping("/test/test-names")
    public ResponseEntity<List<IdNameDTO>> getAllTestNames(
            @RequestBody PatientHistoryRequest patientRequest,
            @CurrentDoctor Doctor doctor) {

        List<IdNameDTO> testNames =
                doctorMedicalHistoryService.getPatientsTestNames(
                        patientRequest.getPatientId(),
                        doctor.getDoctorId()
                );

        if (testNames.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(testNames);
    }

    @PostMapping("/test/all")
    public ResponseEntity<List<TestSummaryDTO>> getAllTests(
            @RequestBody
            @Valid
            DoctorTestListRequest testListRequest,
            @CurrentDoctor Doctor doctor) {

        List<TestSummaryDTO> patientsAllTests =
                doctorMedicalHistoryService.getPatientsAllTestsList(
                        testListRequest,
                        doctor.getDoctorId()
                );

        if (patientsAllTests.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(patientsAllTests);


    }

    @PostMapping("/test/result")
    public ResponseEntity<TestResultDTO> getTestResult(
             @RequestBody
             @Valid
             TestResultRequest testResultRequest,
             @CurrentDoctor Doctor doctor) {

         TestResultDTO testResultDetails =
                doctorMedicalHistoryService
                        .getPatientsTestResultDetails(
                                testResultRequest.getPerformedTestId(),
                                doctor.getDoctorId()
                );

        if (testResultDetails == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(testResultDetails);
    }
}
