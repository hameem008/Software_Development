//package com.example.MediLine.Service.Patient;
//
//import com.example.MediLine.DTO.DoctorBaseDTO;
//import com.example.MediLine.DTO.HospitalBaseDTO;
//import com.example.MediLine.DTO.MedicalHistoryDTO.*;
//import com.example.MediLine.DTO.MedicalHistoryDTO.TestResultDTO.ResultEntry;
//import com.example.MediLine.Entity.*;
//import com.example.MediLine.Repository.*;
//import com.example.MediLine.Service.MedicalHistoryService;
//import com.example.MediLine.TestDataFactory;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//public class PatientMedicalHistoryServiceTest {
//
//    @Mock
//    private SymptomRepository symptomRepository;
//    @Mock private PerformedTestRepository performedTestRepository;
//    @Mock private PatientRepository patientRepository;
//    @Mock private SeverityLevelRepository severityRepository;
//    @Mock private MoodOptionRepository moodRepository;
//    @Mock private PrescriptionRepository prescriptionRepository;
//    @Mock private DiagnosedDiseaseRepository diagnosedDiseaseRepository;
//    @Mock private PrescribedMedicineRepository prescribedMedicineRepository;
//    @Mock private PrescribedTestRepository prescribedTestRepository;
//    @Mock private TestResultValueRepository testResultValueRepository;
//    @Mock private TestParamRepository testParamRepository;
//
//    @InjectMocks
//    private PatientMedicalHistoryService patientHistoryService;
//
//    @InjectMocks
//    private MedicalHistoryService medicalHistoryService;
//
//    @BeforeEach
//    void setup() {
//        MockitoAnnotations.openMocks(this);
//
//        patientHistoryService = new PatientMedicalHistoryService(
//                symptomRepository, performedTestRepository,
//                patientRepository, severityRepository,
//                moodRepository, prescriptionRepository, medicalHistoryService
//        );
//    }
//
//    /* symptom tests */
//    @Test
//    void testGetAllSymptoms_returnsSymptomDTOList() {
//        Symptom symptom = TestDataFactory.createSymptom();
//
//        when(symptomRepository.findSymptomsByPatientId(1))
//                .thenReturn(List.of(symptom));
//
//        List<SymptomDTO> result = patientHistoryService.getAllSymptoms(1);
//
//        assertEquals(1, result.size());
//        assertEquals(symptom.getDescription(), result.getFirst().getDescription());
//        assertEquals(symptom.getOverallMood(), result.getFirst().getOverallMood());
//    }
//
//    @Test
//    void testGetAllSymptoms_returnsEmptyList() {
//        when(symptomRepository.findSymptomsByPatientId(1))
//                .thenReturn(Collections.emptyList());
//
//        List<SymptomDTO> result = patientHistoryService.getAllSymptoms(1);
//
//        assertEquals(0, result.size());
//        assertEquals(Collections.emptyList(), result);
//    }
//
//    @Test
//    void testCreateSymptom_savesSuccessfully() {
//        Patient patient = TestDataFactory.createPatient();
//        when(patientRepository.findByPatientId(1))
//                .thenReturn(Optional.of(patient));
//
//        CreateSymptomRequest request = new CreateSymptomRequest(
//                "Fever", "Sad", 3);
//
//        patientHistoryService.createSymptom(1, request);
//
//        verify(symptomRepository, times(1)).save(any(Symptom.class));
//    }
//
//    /* doctor base DTO test */
//    @Test
//    void testCreateDoctorBaseDTO_withValidDoctor() {
//        Doctor doctor = TestDataFactory.createDoctor(1);
//
//        DoctorBaseDTO dto = patientHistoryService.createDoctorBaseDTO(doctor);
//
//        assertNotNull(dto);
//        assertEquals(doctor.getDoctorId(), dto.getDoctorId());
//        assertEquals(doctor.getFirstName() + " " + doctor.getLastName(), dto.getName());
//        assertEquals(doctor.getSpecialization(), dto.getSpecialization());
//        assertEquals(doctor.getDesignation(), dto.getDesignation());
//        assertEquals(doctor.getAcademicInstitution(), dto.getAcademicInstitution());
//    }
//
//    @Test
//    void testCreateDoctorBaseDTO_withNullDoctor_returnsNull() {
//        DoctorBaseDTO dto = patientHistoryService.createDoctorBaseDTO(null);
//        assertNull(dto);
//    }
//
//    /* All performed medical-test list test*/
//    @Test
//    void testGetAllPerformedTests() {
//
//        PerformedTest performedTest = TestDataFactory.createPerformedTest();
//        when(performedTestRepository.findByPatientIdWithDetails(1))
//                .thenReturn(List.of(performedTest));
//
//        List<TestSummaryDTO> result = patientHistoryService.getAllPerformedTests(1);
//
//        assertEquals(1, result.size());
//        assertEquals(performedTest.getPerformedTestId(), result.getFirst().getPerformedTestId());
//        assertEquals(performedTest.getTest().getTestName(), result.getFirst().getName());
//        assertEquals(performedTest.getPrescription().getDoctor().getDoctorId(),
//                result.getFirst().getOrderedBy().getDoctorId());
//        assertEquals(performedTest.getTestDate(), result.getFirst().getDate());
//        assertEquals(performedTest.getPrescription().getHospital().getName(),
//                result.getFirst().getHospital().getName());
//    }
//
//     @Test
//    void testGetAllPerformedTests_ReturnEmptyList() {
//
//        when(performedTestRepository.findByPatientIdWithDetails(1))
//                .thenReturn(Collections.emptyList());
//
//        List<TestSummaryDTO> result = patientHistoryService.getAllPerformedTests(1);
//
//        assertEquals(0, result.size());
//        assertTrue(result.isEmpty());
//    }
//
//    /* hospital base DTO test */
//    @Test
//    void testCreateHospitalBaseDTO_withValidHospital() {
//        Hospital hospital = TestDataFactory.createHospital();
//
//        HospitalBaseDTO dto = patientHistoryService.createHospitalBaseDTO(hospital);
//
//        assertNotNull(dto);
//        assertEquals(hospital.getHospitalId(), dto.getHospitalId());
//        assertEquals(hospital.getName(), dto.getName());
//        assertEquals(hospital.getAddress(), dto.getAddress());
//    }
//
//    @Test
//    void testCreateHospitalBaseDTO_withNullHospital_returnsNull() {
//
//        HospitalBaseDTO dto = patientHistoryService.createHospitalBaseDTO(null);
//        assertNull(dto);
//    }
//
//    /* medication test */
//    @Test
//    void testCreateMedicationDTO_withValidPrescribedMedicine() {
//        PrescribedMedicine prescribedMedicine =
//                TestDataFactory.createPrescribedMedicine();
//        Medication medication =
//                patientHistoryService.createMedicationDTO(prescribedMedicine);
//
//        assertNotNull(medication);
//        assertEquals("Napa", medication.getName());
//        assertEquals("500mg", medication.getDosage());
//        assertEquals("2 times a day", medication.getFrequency());
//        assertEquals("5 days", medication.getDuration());
//    }
//
//    @Test
//    void testCreateMedicationDTO_withNullPrescribedMedicine_returnsNull() {
//        Medication medication = patientHistoryService.createMedicationDTO(null);
//        assertNull(medication);
//    }
//
//    /* medical-test result test */
//    @Test
//    void getPerformedTestOrThrow_validTestAndPatient_returnsPerformedTest() {
//        PerformedTest test = TestDataFactory.createPerformedTest();
//        when(performedTestRepository.findById(1, 1))
//            .thenReturn(Optional.of(test));
//
//        PerformedTest result = patientHistoryService.getPerformedTestOrThrow(1, 1);
//
//        assertNotNull(result);
//        assertEquals(test.getTest().getTestName(), result.getTest().getTestName());
//        assertEquals(test.getTestDate(), result.getTestDate());
//        assertEquals(test.getPrescription().getPrescriptionId(),
//                result.getPrescription().getPrescriptionId());
//        assertEquals(test.getHospital().getHospitalId(), result.getHospital().getHospitalId());
//    }
//
//    @Test
//    void getPerformedTestOrThrow_invalidTest_throwsException() {
//        when(performedTestRepository.findById(1, 5))
//            .thenReturn(Optional.empty());
//
//        assertThrows(IllegalArgumentException.class, () ->
//            patientHistoryService.getPerformedTestOrThrow(1, 1)
//        );
//    }
//
//    @Test
//    void mapTestResults_validValuesAndParams_mapsCorrectly() {
//        PerformedTest performedTest = TestDataFactory.createPerformedTest();
//        TestParam testParam = TestDataFactory.createTestParam();
//        TestResultValue testResultValue = TestDataFactory.createTestResultValue();
//
//
//         when(testResultValueRepository.findByPerformedTestPerformedTestId(1))
//                .thenReturn(List.of(testResultValue));
//
//         when(testParamRepository.findByTestId(1))
//                .thenReturn(List.of(testParam));
//
//        List<TestResultDTO.ResultEntry> results = patientHistoryService
//                .mapTestResults(performedTest);
//
//        TestResultDTO.ResultEntry entry = results.getFirst();
//
//        assertEquals(1, results.size());
//        assertEquals("Hemoglobin", entry.getName());
//        assertEquals("13.5", entry.getValue());
//        assertEquals("g/dL", entry.getUnit());
//    }
//
//    @Test
//    void buildTestResultDTO_validTest_buildsCorrectDTO() {
//        PerformedTest test = TestDataFactory.createPerformedTest();
//        List<ResultEntry> entries = List.of(ResultEntry.builder()
//                .name("Hemoglobin")
//                .value("13.5")
//                .unit("g/dL")
//                .build());
//
//        TestResultDTO dto = patientHistoryService.buildTestResultDTO(test, entries);
//
//        assertEquals(test.getPerformedTestId(), dto.getPerformedTestId());
//        assertEquals("Hemoglobin", dto.getResults().getFirst().getName());
//        assertEquals("13.5", dto.getResults().getFirst().getValue());
//        assertEquals(test.getPrescription().getDoctor().getDoctorId(), dto.getOrderedBy().getDoctorId());
//        assertEquals(test.getPerformedByDoctor().getDoctorId(), dto.getPerformedBy().getDoctorId());
//        assertEquals(test.getReviewedByDoctor().getDoctorId(), dto.getReviewedBy().getDoctorId());
//        assertEquals(test.getHospital().getHospitalId(), dto.getHospital().getHospitalId());
//    }
//
//
//    /* prescription details */
//    @Test
//    void getPrescriptionDetails_validInput_returnsCompleteDTO() {
//        int prescriptionId = 1;
//        int patientId = 1;
//
//        Prescription prescription = TestDataFactory.createPrescription();
//        when(prescriptionRepository.findByPrescriptionId(prescriptionId, patientId))
//                .thenReturn(Optional.of(prescription));
//
//        when(prescribedMedicineRepository.findByPrescriptionId(prescriptionId, patientId))
//                .thenReturn(List.of(TestDataFactory.createPrescribedMedicine()));
//
//        when(diagnosedDiseaseRepository.findDiseaseNamesByPrescriptionId(prescriptionId, patientId))
//                .thenReturn(List.of("Diabetes", "Hypertension"));
//
//        when(prescribedTestRepository.findTestsByPrescriptionId(prescriptionId, patientId))
//                .thenReturn(List.of("CBC", "Lipid Profile"));
//
//        PrescriptionDTO dto = patientHistoryService.getPrescriptionDetails(prescriptionId, patientId);
//
//        assertEquals("1", dto.getPrescriptionId());
//        assertEquals(prescription.getDoctor().getDoctorId(), dto.getDoctor().getDoctorId());
//        assertEquals("120/80", dto.getVitals().getBloodPressure().getValue());
//        assertEquals("Diabetes", dto.getDiagnosis().getFirst());
//        assertEquals("CBC", dto.getTests().getFirst());
//        assertEquals("Napa", dto.getMedications().getFirst().getName());
//    }
//
//    @Test
//    void getPrescriptionDetails_prescriptionNotFound_throwsException() {
//        when(prescriptionRepository.findByPrescriptionId(1, 1))
//                .thenReturn(Optional.empty());
//
//        assertThrows(IllegalArgumentException.class, () ->
//                patientHistoryService.getPrescriptionDetails(1, 1));
//    }
//
//
//
//}
//
//
