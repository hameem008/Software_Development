package com.example.MediLine.Service.Patient;


import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.HospitalBaseDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Entity.Symptom;
import com.example.MediLine.Repository.*;
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


    public List<SymptomDTO> getAllSymptoms(
              Integer patientId) {

        return symptomRepository.findSymptomsByPatientId(patientId)
            .stream()
            .map(s -> new SymptomDTO(
                    s.getDescription(),
                    s.getSymptomId().getDate(),
                    s.getSymptomId().getTime(),
                    s.getOverallMood(),
                    s.getSeverityLevel()
            ))
            .toList();
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
        return performedTestRepository.findByPatientIdWithDetails(patientId).stream().map(pt -> {

            DoctorBaseDTO orderedBy;
            Doctor doctor = pt.getPrescription().getDoctor();
            if (doctor != null) {
                orderedBy = DoctorBaseDTO.builder()
                    .doctorId(doctor.getDoctorId())
                    .name(doctor.getFirstName() + " " + doctor.getLastName())
                    .specialization(doctor.getSpecialization())
                    .designation(doctor.getDesignation())
                    .academicInstitution(doctor.getAcademicInstitution())
                    .build();
            } else {
                orderedBy = null;
            }

            DoctorBaseDTO performedBy;
            doctor = pt.getPerformedByDoctor();
            if (doctor != null) {
                performedBy = DoctorBaseDTO.builder()
                    .doctorId(doctor.getDoctorId())
                    .name(doctor.getFirstName() + " " + doctor.getLastName())
                    .specialization(doctor.getSpecialization())
                    .designation(doctor.getDesignation())
                    .academicInstitution(doctor.getAcademicInstitution())
                    .build();
            } else {
                performedBy = null;
            }

            DoctorBaseDTO reviewedBy;
            doctor = pt.getReviewedByDoctor();
            if (doctor != null) {
                reviewedBy = DoctorBaseDTO.builder()
                    .doctorId(doctor.getDoctorId())
                    .name(doctor.getFirstName() + " " + doctor.getLastName())
                    .specialization(doctor.getSpecialization())
                    .designation(doctor.getDesignation())
                    .academicInstitution(doctor.getAcademicInstitution())
                    .build();
            } else {
                reviewedBy = null;
            }

            HospitalBaseDTO hospital;
            if (pt.getHospital() != null) {
                hospital = HospitalBaseDTO.builder()
                    .hospitalId(pt.getHospital().getHospitalId())
                    .name(pt.getHospital().getName())
                    .address(pt.getHospital().getAddress())
                    .build();
            } else {
                hospital = null;
            }

            return TestSummaryDTO.builder()
                    .performedTestId(pt.getPerformedTestId())
                    .name(pt.getTest().getName())
                    .orderedBy(orderedBy)
                    .date(pt.getTestDate())
                    .performedBy(performedBy)
                    .reviewedBy(reviewedBy)
                    .hospital(hospital)
                    .build();
        }).toList();
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
}
