package com.example.MediLine.Service.Patient;


import com.example.MediLine.DTO.MedicalHistoryDTO.CreateSymptomRequest;
import com.example.MediLine.DTO.MedicalHistoryDTO.MoodOptionDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.SeverityLevelDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.SymptomDTO;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Entity.Symptom;
import com.example.MediLine.Repository.MoodOptionRepository;
import com.example.MediLine.Repository.PatientRepository;
import com.example.MediLine.Repository.SeverityLevelRepository;
import com.example.MediLine.Repository.SymptomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientHistoryService {

    private final SymptomRepository symptomRepository;
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
