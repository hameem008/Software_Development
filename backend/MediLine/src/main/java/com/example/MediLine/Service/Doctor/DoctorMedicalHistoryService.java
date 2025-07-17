package com.example.MediLine.Service.Doctor;

import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Repository.AppointmentRepository;
import com.example.MediLine.Repository.PerformedTestRepository;
import com.example.MediLine.Repository.PrescriptionRepository;
import com.example.MediLine.Service.MedicalHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorMedicalHistoryService {
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalHistoryService medicalHistoryService;
    private final PerformedTestRepository performedTestRepository;


    public List<SymptomDTO> getPatientsSymptoms(Integer patientId, Integer doctorId) {
        if (notDoctorsPatient(doctorId, patientId)) {
            throw new IllegalArgumentException("Doctor is not associated with this patient.");
        }

        return medicalHistoryService.getAllSymptoms(patientId);
    }

    public List<TestSummaryDTO> getPatientsAllTestsList(
            DoctorTestListRequest doctorTestListRequest, Integer doctorId) {

        if (notDoctorsPatient(doctorId, doctorTestListRequest.getPatientId())) {
            throw new IllegalArgumentException("Doctor is not associated with this patient.");
        }

        TestListRequest testRequest = TestListRequest.builder()
                .dateFrom(doctorTestListRequest.getDateFrom())
                .dateTo(doctorTestListRequest.getDateTo())
                .testId(doctorTestListRequest.getTestId())
                .build();

        return medicalHistoryService.getAllPerformedTests(
                testRequest, doctorTestListRequest.getPatientId());
    }

    public TestResultDTO getPatientsTestResultDetails(Integer performedTestId, Integer doctorId) {
        if (!performedTestRepository.doctorIsAuthorized(doctorId, performedTestId)) {
            throw new IllegalArgumentException("Doctor is not associated with this patient.");
        }

        return medicalHistoryService.getTestResultDetails(performedTestId);
    }

    public List<PrescriptionSummaryDTO> getPatientsAllPrescriptions(
            DoctorPrescriptionListRequest request, Integer doctorId) {

        if(notDoctorsPatient(doctorId, request.getPatientId())) {
            throw new IllegalArgumentException("Doctor is not associated with this patient.");
        }

        PrescriptionListRequest prescriptionRequest = PrescriptionListRequest.builder()
                .dateFrom(request.getDateFrom())
                .dateTo(request.getDateTo())
                .doctorId(doctorId)
                .diseaseId(request.getDiseaseId())
                .keyword(request.getKeyword())
                .build();

        return medicalHistoryService.getAllPrescriptionsList(prescriptionRequest, request.getPatientId());
    }

    public PrescriptionDTO getPatientsPrescription(Integer prescriptionId, Integer doctorId) {
        if(!prescriptionRepository.doctorIsAuthorized(prescriptionId, doctorId)) {
            throw new IllegalArgumentException("Doctor is not associated with this patient.");
        }

        return medicalHistoryService.getPrescriptionDetails(prescriptionId);
    }

    public List<IdNameDTO> getPatientsDiseaseNames(Integer patientId, Integer doctorId) {
        if (notDoctorsPatient(doctorId, patientId)) {
            throw new IllegalArgumentException("Doctor is not associated with this patient.");
        }

        return medicalHistoryService.getDiagnosedDiseaseNames(patientId);
    }

    public List<IdNameDTO> getPatientsDoctorNames(Integer patientId, Integer doctorId) {
        if (notDoctorsPatient(doctorId, patientId)) {
            throw new IllegalArgumentException("Doctor is not associated with this patient.");
        }

        return medicalHistoryService.getPrescriptionDoctors(patientId);
    }

    public List<IdNameDTO> getPatientsTestNames(Integer patientId, Integer doctorId) {
        if (notDoctorsPatient(doctorId, patientId)) {
            throw new IllegalArgumentException("Doctor is not associated with this patient.");
        }

        return medicalHistoryService.getPerformedTestNames(patientId);
    }


    protected boolean notDoctorsPatient(Integer doctorId, Integer patientId) {
        boolean viaPrescription = prescriptionRepository
                .existsByDoctorAndPatient(doctorId, patientId);
        boolean viaAppointment = appointmentRepository
                .existsByDoctorAndPatient(doctorId, patientId);

        return !viaPrescription && !viaAppointment;
    }

}
