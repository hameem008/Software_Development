package com.example.MediLine.Service.Patient;


import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.*;
import com.example.MediLine.Service.MedicalHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientMedicalHistoryService {

    private final SymptomRepository symptomRepository;
    private final PerformedTestRepository performedTestRepository;
    private final PatientRepository patientRepository;
    private final SeverityLevelRepository severityRepository;
    private final MoodOptionRepository moodRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicalHistoryService medicalHistoryService;


    public List<SymptomDTO> getAllSymptoms(Integer patientId) {

       return medicalHistoryService.getAllSymptoms(patientId);
    }

    public void createSymptom(Integer patientId, CreateSymptomRequest request) {
        Patient patient = patientRepository.findByPatientId(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        LocalDate nowDate = LocalDate.now();
        LocalTime nowTime = LocalTime.now();

        Symptom.SymptomId id = new Symptom.SymptomId(patientId, nowDate, nowTime);

        Symptom symptom = new Symptom();
        symptom.setSymptomId(id);
        symptom.setPatient(patient);
        symptom.setDescription(request.getDescription());
        symptom.setOverallMood(request.getOverallMood());
        symptom.setSeverityLevel(request.getSeverityLevel());

        symptomRepository.save(symptom);
    }


    public List<TestSummaryDTO> getAllPerformedTests(TestListRequest testListRequest, Integer patientId) {

        return medicalHistoryService.getAllPerformedTests(testListRequest, patientId);
    }

    public PrescriptionDTO getPrescriptionDetails(Integer prescriptionId, Integer patientId) {
        if(!prescriptionRepository.patientIsAuthorized(prescriptionId, patientId)) {
            throw new IllegalArgumentException("Access denied");
        }

        return medicalHistoryService.getPrescriptionDetails(prescriptionId);
    }


    public List<SeverityLevelDTO> getAllSeverityLevels() {
        return severityRepository.findAllByOrderBySeverityLevelAsc()
                .stream()
                .map(s ->
                        new SeverityLevelDTO(s.getSeverityLevel(), s.getDescription()))
                .toList();
    }

    public List<MoodOptionDTO> getAllMoodOptions() {
        return moodRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(m ->
                        new MoodOptionDTO(m.getDisplayOrder(), m.getMoodValue()))
                .toList();
    }


    public TestResultDTO getTestResult(Integer performedTestId, Integer patientId) {
        if(!performedTestRepository.patientIsAuthorized(performedTestId, patientId)) {
            throw new IllegalArgumentException("Access denied");
        }

        return medicalHistoryService.getTestResultDetails(performedTestId);
    }

    public List<PrescriptionSummaryDTO> getPrescriptionSummaries(
            PrescriptionListRequest request,
            Integer patientId) {

        return medicalHistoryService.getAllPrescriptionsList(request, patientId);
    }

    public List<IdNameDTO> getDiagnosedDiseaseNames(Integer patientId) {
        return medicalHistoryService.getDiagnosedDiseaseNames(patientId);
    }

    public List<IdNameDTO> getPrescriptionDoctors(Integer patientId) {
        return medicalHistoryService.getPrescriptionDoctors(patientId);
    }

    public List<IdNameDTO> getPerformedTestNames(Integer patientId) {
        return medicalHistoryService.getPerformedTestNames(patientId);
    }

}

