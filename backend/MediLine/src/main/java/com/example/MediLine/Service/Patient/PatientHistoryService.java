package com.example.MediLine.Service.Patient;


import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.HospitalBaseDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.*;
import com.example.MediLine.DTO.MedicalHistoryDTO.TestResultDTO.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientHistoryService {

    private final SymptomRepository symptomRepository;
    private final PerformedTestRepository performedTestRepository;
    private final PatientRepository patientRepository;
    private final SeverityLevelRepository severityRepository;
    private final MoodOptionRepository moodRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final DiagnosedDiseaseRepository diagnosedDiseaseRepository;
    private final PrescribedMedicineRepository prescribedMedicineRepository;
    private final PrescribedTestRepository prescribedTestRepository;
    private final TestResultValueRepository testResultValueRepository;
    private final TestParamRepository testParamRepository;


    public List<SymptomDTO> getAllSymptoms(Integer patientId) {

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
        Prescription prescription = prescriptionRepository
                .findByPrescriptionIdAndPatientId(prescriptionId, patientId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));

        Vitals vitals = Vitals.builder()
                .bloodPressure(new Vitals.Measurement(
                        "Blood Pressure", prescription.getBloodPressure(), "mmHg"))
                .weight(new Vitals.Measurement(
                        "Weight", prescription.getWeight() + "", "kg"))
                .heartRate(new Vitals.Measurement(
                        "Heart Rate", prescription.getHeartRate() + "", "kg"))
                .build();

        List<Medication> medications =
                prescribedMedicineRepository.findByPrescriptionId(prescriptionId, patientId)
                .stream()
                .map(this::createMedicationDTO)
                .toList();

        return PrescriptionDTO.builder()
                .prescriptionId(prescriptionId.toString())
                .doctor(createDoctorBaseDTO(prescription.getDoctor()))
                .issuedDate(prescription.getPrescribedDate())
                .summary(prescription.getSummary())
                .vitals(vitals)
                .symptoms(prescription.getSymptoms())
                .diagnosis(diagnosedDiseaseRepository
                        .findDiseaseNamesByPrescriptionId(prescriptionId, patientId)
                )
                .medications(medications)
                .tests(prescribedTestRepository
                        .findTestsByPrescriptionId(prescriptionId, patientId)
                )
                .notes(prescription.getNotes())
                .nextAppointment(prescription.getNextAppointmentDate())
                .build();
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
        PerformedTest performedTest = getPerformedTestOrThrow(testId, patientId);
        List<ResultEntry> results = mapTestResults(performedTest);

        return buildTestResultDTO(performedTest, results);
    }

    protected PerformedTest getPerformedTestOrThrow(Integer testId, Integer patientId) {
        return performedTestRepository.findByIdAndPatientId(testId, patientId)
                .orElseThrow(() -> new IllegalArgumentException("Test not found or access denied."));
    }

    protected List<ResultEntry> mapTestResults(PerformedTest performedTest) {
        Integer testId = performedTest.getTest().getTestId();

        List<TestResultValue> values = testResultValueRepository
                .findByPerformedTestPerformedTestId(testId);
        List<TestParam> params = testParamRepository
                .findByTestId(testId);

        return createResultEntries(values, params);
    }

    protected TestResultDTO buildTestResultDTO(PerformedTest test, List<ResultEntry> results) {
        return TestResultDTO.builder()
                .performedTestId(test.getPerformedTestId())
                .name(test.getTest().getTestName())
                .date(test.getTestDate())
                .notes(test.getNote())
                .orderedBy(createDoctorBaseDTO(test.getPrescription().getDoctor()))
                .performedBy(createDoctorBaseDTO(test.getPerformedByDoctor()))
                .reviewedBy(createDoctorBaseDTO(test.getReviewedByDoctor()))
                .hospital(createHospitalBaseDTO(test.getHospital()))
                .results(results)
                .build();
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


    protected Medication createMedicationDTO(PrescribedMedicine prescribedMedicine) {
        if( prescribedMedicine == null ||
                prescribedMedicine.getMedicine() == null) {
            return null;
        }

        return Medication.builder()
                .name(prescribedMedicine.getMedicine().getMedicineName())
                .dosage(prescribedMedicine.getDosage())
                .frequency(prescribedMedicine.getFrequency())
                .duration(prescribedMedicine.getDurationValue() + " " +
                        prescribedMedicine.getDurationUnit())
                .build();
    }

    protected List<ResultEntry> createResultEntries(List<TestResultValue> values, List<TestParam> params) {
        Map<String, TestParam> paramMap = params.stream()
                .collect(Collectors.toMap(p -> p.getId().getParameterName(), p -> p));

        return values.stream().map(value -> {
            TestParam param = paramMap.get(value.getId().getParameterName());
            return ResultEntry.builder()
                    .name(value.getId().getParameterName())
                    .value(value.getResultValue())
                    .unit(param != null ? param.getUnit() : null)
                    .idealMaleRange(param != null ? param.getIdealMaleRange() : null)
                    .idealFemaleRange(param != null ? param.getIdealFemaleRange() : null)
                    .idealChildRange(param != null ? param.getIdealChildrenRange() : null)
                    .build();
        }).collect(Collectors.toList());
    }
}
