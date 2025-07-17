package com.example.MediLine.Service.Patient;


import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.HospitalBaseDTO;
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
public class PatientHistoryService {

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


    public List<TestSummaryDTO> getAllPerformedTests(Integer patientId) {
        return performedTestRepository.findByPatientIdWithDetails(patientId)
                .stream().map(pt -> {

            DoctorBaseDTO orderedBy = createDoctorBaseDTO(pt.getPrescription().getDoctor());
            DoctorBaseDTO performedBy = createDoctorBaseDTO(pt.getPerformedByDoctor());
            DoctorBaseDTO reviewedBy = createDoctorBaseDTO(pt.getReviewedByDoctor());

            HospitalBaseDTO hospital =
                    createHospitalBaseDTO(pt.getHospital());

            return TestSummaryDTO.builder()
                    .performedTestId(pt.getPerformedTestId())
                    .name(pt.getTest().getTestName())
                    .orderedBy(orderedBy)
                    .date(pt.getTestDate())
                    .performedBy(performedBy)
                    .reviewedBy(reviewedBy)
                    .hospital(hospital)
                    .build();
        }).toList();
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


    public TestResultDTO getTestResult(Integer testId, Integer patientId) {
        if(!performedTestRepository.patientIsAuthorized(testId, patientId)) {
            throw new IllegalArgumentException("Access denied");
        }

        return medicalHistoryService.getTestResultDetails(testId);
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

    protected DoctorBaseDTO createDoctorBaseDTO(Doctor doctor) {
        if (doctor == null) {
            return null;
        }
        return DoctorBaseDTO.builder()
                .doctorId(doctor.getDoctorId())
                .name(doctor.getFirstName() + " " + doctor.getLastName())
                .specialization(doctor.getSpecialization())
                .designation(doctor.getDesignation())
                .academicInstitution(doctor.getAcademicInstitution())
                .build();
    }


    protected HospitalBaseDTO createHospitalBaseDTO(Hospital hospital) {
        if (hospital == null) {
            return null;
        }
        return HospitalBaseDTO.builder()
                .hospitalId(hospital.getHospitalId())
                .name(hospital.getName())
                .address(hospital.getAddress())
                .build();
    }



}

