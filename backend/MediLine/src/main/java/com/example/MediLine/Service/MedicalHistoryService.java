package com.example.MediLine.Service;



import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.HospitalBaseDTO;
import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.*;
import com.example.MediLine.DTO.MedicalHistoryDTO.TestResultDTO.*;
import com.example.MediLine.Repository.Specification.PerformedTestSpecification;
import com.example.MediLine.Repository.Specification.PrescriptionSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalHistoryService {

    private final SymptomRepository symptomRepository;
    private final PerformedTestRepository performedTestRepository;
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


    public List<TestSummaryDTO> getAllPerformedTests(TestListRequest request, Integer patientId) {
        Specification<PerformedTest> spec = PerformedTestSpecification
                .filterPerformedTests(request, patientId);

        return performedTestRepository.findAll(spec)
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


    public PrescriptionDTO getPrescriptionDetails(Integer prescriptionId) {
        Prescription prescription = prescriptionRepository
                .findByPrescriptionId(prescriptionId)
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
                prescribedMedicineRepository.findByPrescriptionId(prescriptionId)
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
                        .findDiseaseNamesByPrescriptionId(prescriptionId)
                )
                .medications(medications)
                .tests(prescribedTestRepository
                        .findTestsByPrescriptionId(prescriptionId)
                )
                .notes(prescription.getNotes())
                .nextAppointment(prescription.getNextAppointmentDate())
                .build();
    }


    public TestResultDTO getTestResultDetails(Integer testId) {
        PerformedTest performedTest = getPerformedTest(testId);
        List<ResultEntry> results = getTestResultValues(performedTest);

        return createTestResultDTO(performedTest, results);
    }

    public List<PrescriptionSummaryDTO> getAllPrescriptionsList(
            PrescriptionListRequest request,
            Integer patientId) {

        Specification<Prescription> spec = PrescriptionSpecification.filterByRequest(request, patientId);

        List<Prescription> prescriptions = prescriptionRepository.findAll(spec);

        return prescriptions.stream()
                .map(this::createPrescriptionSummary)
                .toList();
    }

    protected PrescriptionSummaryDTO createPrescriptionSummary(Prescription prescription) {
        if(prescription == null) {
            return null;
        }

        Doctor doctor = prescription.getDoctor();
        return PrescriptionSummaryDTO.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                .doctorId(doctor.getDoctorId())
                .issuedDate(prescription.getPrescribedDate())
                .summary(prescription.getSummary())
                .build();
    }

    protected PerformedTest getPerformedTest(Integer testId) {
        System.out.println("Fetching performed test with ID: " + testId);
        return performedTestRepository.findByPerformedTestId(testId)
                .orElseThrow(() -> new IllegalArgumentException("Test not found or access denied."));
    }

    protected List<ResultEntry> getTestResultValues(PerformedTest performedTest) {
        Integer testId = performedTest.getTest().getId();

        List<TestResultValue> values = testResultValueRepository
                .findByPerformedTestPerformedTestId(testId);
        List<TestParam> params = testParamRepository
                .findByTestId(testId);

        return createResultEntries(values, params);
    }

    protected TestResultDTO createTestResultDTO(PerformedTest test, List<ResultEntry> results) {
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
                .medicineId(prescribedMedicine.getMedicine().getMedicineId())
                .name(prescribedMedicine.getMedicine().getMedicineName())
                .dosage(prescribedMedicine.getDosage())
                .frequency(prescribedMedicine.getFrequency())
                .durationValue(prescribedMedicine.getDurationValue())
                .durationUnit(prescribedMedicine.getDurationUnit())
                .instructions(prescribedMedicine.getInstruction())
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

    public List<IdNameDTO> getDiagnosedDiseaseNames(Integer patientId) {
        return diagnosedDiseaseRepository.findDiseasesByPatientId(patientId)
                .stream()
                .map(disease -> new IdNameDTO(
                        disease.getDiseaseId(),
                        disease.getDiseaseName()
                ))
                .toList();
    }

    public List<IdNameDTO> getPrescriptionDoctors(Integer patientId) {
        return prescriptionRepository.findPrescriptionDoctors(patientId)
                .stream()
                .map(doctor -> new IdNameDTO(
                        doctor.getDoctorId(),
                        doctor.getFirstName() + " " + doctor.getLastName()
                ))
                .toList();
    }

    public List<IdNameDTO> getPerformedTestNames(Integer patientId) {
        return performedTestRepository.findTestsByPatientId(patientId)
                .stream()
                .map(test -> new IdNameDTO(
                        test.getId(),
                        test.getTestName()
                ))
                .toList();
    }
}

