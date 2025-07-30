package com.example.MediLine.Service.Doctor;

import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Repository.PatientRepository;
import com.example.MediLine.Service.MedicalHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorMedicalHistoryService {
    private final MedicalHistoryService medicalHistoryService;
    private final DoctorAuthorizationService doctorAuthorizationService;
    private final PatientRepository patientRepository;


    public List<SymptomDTO> getPatientsSymptoms(Integer patientId, Integer doctorId) {
        doctorAuthorizationService
                .checkDoctorsAccessToPatient(doctorId, patientId);

        return medicalHistoryService.getAllSymptoms(patientId);
    }

    public List<TestSummaryDTO> getPatientsAllTestsList(
            DoctorTestListRequest doctorTestListRequest, Integer doctorId) {

         doctorAuthorizationService
                .checkDoctorsAccessToPatient(
                        doctorId, doctorTestListRequest.getPatientId());


        TestListRequest testRequest = TestListRequest.builder()
                .dateFrom(doctorTestListRequest.getDateFrom())
                .dateTo(doctorTestListRequest.getDateTo())
                .testId(doctorTestListRequest.getTestId())
                .build();

        return medicalHistoryService.getAllPerformedTests(
                testRequest, doctorTestListRequest.getPatientId());
    }

    public List<TestSummaryDTO> getPatientsAllTestsListViaEmail(
            String patientEmail, Integer doctorId) {

        int patientId = patientRepository.findByEmail(patientEmail).orElseThrow(
                () -> new IllegalArgumentException("Patient not found with email: "))
                .getPatientId();

         doctorAuthorizationService
                .checkDoctorsAccessToPatient(
                        doctorId, patientId);


        TestListRequest testRequest = TestListRequest.builder()
                .dateFrom(null)
                .dateTo(null)
                .testId(null)
                .build();

        return medicalHistoryService.getAllPerformedTests(
                testRequest, patientId);
    }

    public TestResultDTO getPatientsTestResultDetails(Integer performedTestId, Integer doctorId) {
        doctorAuthorizationService
                .checkDoctorsAccessToTestResult(doctorId, performedTestId);

        return medicalHistoryService.getTestResultDetails(performedTestId);
    }

    public List<PrescriptionSummaryDTO> getPatientsAllPrescriptions(
            DoctorPrescriptionListRequest request, Integer doctorId) {

        doctorAuthorizationService
                .checkDoctorsAccessToPatient(
                        doctorId, request.getPatientId());


        PrescriptionListRequest prescriptionRequest = PrescriptionListRequest.builder()
                .dateFrom(request.getDateFrom())
                .dateTo(request.getDateTo())
                .doctorId(doctorId)
                .diseaseId(request.getDiseaseId())
                .keyword(request.getKeyword())
                .build();

        return medicalHistoryService.getAllPrescriptionsList(prescriptionRequest, request.getPatientId());
    }


    public List<PrescriptionSummaryDTO> getPatientsAllPrescriptionsViaEmail(
            String patientEmail, Integer doctorId) {

        int patientId = patientRepository.findByEmail(patientEmail).orElseThrow(
                () -> new IllegalArgumentException("Patient not found with email: "))
                .getPatientId();

        System.out.println("Patient ID: " + patientId);
        System.out.println("patientEmail: " + patientEmail);

        doctorAuthorizationService
                .checkDoctorsAccessToPatient(
                        doctorId, patientId);

        PrescriptionListRequest prescriptionRequest = PrescriptionListRequest.builder()
                .dateFrom(null)
                .dateTo(null)
                .doctorId(doctorId)
                .diseaseId(null)
                .keyword(null)
                .build();

        return medicalHistoryService.getAllPrescriptionsList(prescriptionRequest, patientId);
    }

    public PrescriptionDTO getPatientsPrescription(Integer prescriptionId, Integer doctorId) {
        doctorAuthorizationService
                .checkDoctorsAccessToPrescription(doctorId, prescriptionId);

        return medicalHistoryService.getPrescriptionDetails(prescriptionId);
    }

    public List<IdNameDTO> getPatientsDiseaseNames(Integer patientId, Integer doctorId) {
        doctorAuthorizationService
                .checkDoctorsAccessToPatient(doctorId, patientId);

        return medicalHistoryService.getDiagnosedDiseaseNames(patientId);
    }

    public List<IdNameDTO> getPatientsDoctorNames(Integer patientId, Integer doctorId) {
        doctorAuthorizationService
                .checkDoctorsAccessToPatient(doctorId, patientId);

        return medicalHistoryService.getPrescriptionDoctors(patientId);
    }

    public List<IdNameDTO> getPatientsTestNames(Integer patientId, Integer doctorId) {
        doctorAuthorizationService
                .checkDoctorsAccessToPatient(doctorId, patientId);


        return medicalHistoryService.getPerformedTestNames(patientId);
    }

}
