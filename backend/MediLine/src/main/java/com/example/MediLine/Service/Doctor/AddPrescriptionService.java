package com.example.MediLine.Service.Doctor;

import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.CreatePrescriptionRequest;
import com.example.MediLine.DTO.MedicalHistoryDTO.Medication;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AddPrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final MedicineRepository medicineRepository;
    private final DiseaseRepository diseaseRepository;
    private final TestRepository testRepository;
    private final DoctorAuthorizationService doctorAuthorizationService;


    @Transactional
    public void createPrescription(CreatePrescriptionRequest request, Integer doctorId) {
        doctorAuthorizationService
                .checkDoctorsAccessToPatient(doctorId, request.getPatientId());

        Patient patient = patientRepository.findById(Long.valueOf(request.getPatientId()))
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        Prescription prescription = createPrescriptionEntity(request, patient, doctor, hospital);

        Set<DiagnosedDisease> diagnosedDiseases =
                createDiagnosedDiseases(request.getDiagnosis(), prescription);

        Set<PrescribedTest> prescribedTests =
                createPrescribedTests(request.getTests(), prescription);

        Set<PrescribedMedicine> prescribedMedicines =
                createPrescribedMedicines(request.getMedications(), prescription);

        prescription.setDiagnosedDiseases(diagnosedDiseases);
        prescription.setPrescribedTests(prescribedTests);
        prescription.setPrescribedMedicines(prescribedMedicines);

        prescriptionRepository.save(prescription);
    }

    public List<IdNameDTO> getAllDiseaseNames() {
        return diseaseRepository.findAll().stream()
                .map(disease ->
                        new IdNameDTO(disease.getDiseaseId(), disease.getDiseaseName())
                ).toList();
    }

    public List<IdNameDTO> getAllMedicineNames() {
        return medicineRepository.findAll().stream()
                .map(medicine ->
                        new IdNameDTO(medicine.getMedicineId(), medicine.getMedicineName())
                ).toList();
    }

    public List<IdNameDTO> getAllTestNames() {
        return testRepository.findAll().stream()
                .map(test ->
                        new IdNameDTO(test.getId(), test.getTestName())
                ).toList();
    }

    protected Prescription createPrescriptionEntity(
            CreatePrescriptionRequest request, Patient patient,
            Doctor doctor, Hospital hospital) {

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setHospital(hospital);
        prescription.setSummary(request.getSummary());
        prescription.setSymptoms(request.getSymptoms());
        prescription.setWeight(request.getWeight());
        prescription.setBloodPressure(request.getBloodPressure());
        prescription.setHeartRate(request.getHeartRate());
        prescription.setNotes(request.getNotes());
        prescription.setPrescribedDate(LocalDate.now());
        prescription.setNextAppointmentDate(request.getNextAppointment());

        return prescription;
    }

    protected Set<PrescribedMedicine> createPrescribedMedicines(
            List<Medication> medications, Prescription prescription) {

        return medications.stream()
                .map(medication -> {
                    Medicine medicine = medicineRepository.findByMedicineId(medication.getMedicineId())
                            .orElseThrow(() -> new RuntimeException("Test not found"));

                    return PrescribedMedicine.builder()
                            .id(new PrescribedMedicine.PrescribedMedicineId())
                            .medicine(medicine)
                            .dosage(medication.getDosage())
                            .frequency(medication.getFrequency())
                            .durationValue(medication.getDurationValue())
                            .durationUnit(medication.getDurationUnit())
                            .instruction(medication.getInstructions())
                            .prescription(prescription)
                            .build();
                })
               .collect(Collectors.toSet());
    }

    protected Set<PrescribedTest> createPrescribedTests(
            List<Integer> testIds, Prescription prescription) {

        return testIds.stream()
                .map(testId -> {
                    Test test = testRepository.findTestById(testId)
                            .orElseThrow(() -> new RuntimeException("Test not found"));

                    PrescribedTest prescribedTest = new PrescribedTest();
                    prescribedTest.setId(new PrescribedTest.PrescribedTestId());
                    prescribedTest.setTest(test);
                    prescribedTest.setPrescription(prescription);

                    return prescribedTest;
                })
                .collect(Collectors.toSet());
    }

    protected Set<DiagnosedDisease> createDiagnosedDiseases(List<Integer> diseaseIds, Prescription prescription) {
        return diseaseIds.stream()
                .map(diseaseId -> {
                    Disease disease = diseaseRepository.findByDiseaseId(diseaseId)
                            .orElseThrow(() -> new RuntimeException("Disease not found"));

                    DiagnosedDisease diagnosedDisease = new DiagnosedDisease();
                    diagnosedDisease.setId(new DiagnosedDisease.DiagnosedDiseaseId());
                    diagnosedDisease.setDisease(disease);
                    diagnosedDisease.setPrescription(prescription);

                    return diagnosedDisease;
                })
                .collect(Collectors.toSet());
    }
}
