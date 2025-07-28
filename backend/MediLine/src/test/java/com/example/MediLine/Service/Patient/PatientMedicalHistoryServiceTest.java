package com.example.MediLine.Service.Patient;

import com.example.MediLine.DTO.MedicalHistoryDTO.*;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.*;
import com.example.MediLine.Service.MedicalHistoryService;
import com.example.MediLine.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PatientMedicalHistoryServiceTest {

    @Mock private SymptomRepository symptomRepository;
    @Mock private PerformedTestRepository performedTestRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private SeverityLevelRepository severityRepository;
    @Mock private MoodOptionRepository moodRepository;
    @Mock private PrescriptionRepository prescriptionRepository;
    @Mock private DiagnosedDiseaseRepository diagnosedDiseaseRepository;
    @Mock private PrescribedMedicineRepository prescribedMedicineRepository;
    @Mock private PrescribedTestRepository prescribedTestRepository;


    @InjectMocks
    private PatientMedicalHistoryService patientHistoryService;

    @InjectMocks
    private MedicalHistoryService medicalHistoryService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        patientHistoryService = new PatientMedicalHistoryService(
                symptomRepository, performedTestRepository,
                patientRepository, severityRepository,
                moodRepository, prescriptionRepository, medicalHistoryService
        );
    }

    /* symptom tests */
    @Test
    void testGetAllSymptoms_returnsSymptomDTOList() {
        Symptom symptom = TestDataFactory.createSymptom();

        when(symptomRepository.findSymptomsByPatientId(1))
                .thenReturn(List.of(symptom));

        List<SymptomDTO> result = patientHistoryService.getAllSymptoms(1);

        assertEquals(1, result.size());
        assertEquals(symptom.getDescription(), result.getFirst().getDescription());
        assertEquals(symptom.getOverallMood(), result.getFirst().getOverallMood());
    }

    @Test
    void testGetAllSymptoms_returnsEmptyList() {
        when(symptomRepository.findSymptomsByPatientId(1))
                .thenReturn(Collections.emptyList());

        List<SymptomDTO> result = patientHistoryService.getAllSymptoms(1);

        assertEquals(0, result.size());
        assertEquals(Collections.emptyList(), result);
    }

    @Test
    void testCreateSymptom_savesSuccessfully() {
        Patient patient = TestDataFactory.createPatient();
        when(patientRepository.findByPatientId(1))
                .thenReturn(Optional.of(patient));

        CreateSymptomRequest request = new CreateSymptomRequest(
                "Fever", "Sad", 3);

        patientHistoryService.createSymptom(1, request);

        verify(symptomRepository, times(1)).save(any(Symptom.class));
    }


    /* All performed medical-test list test*/
    @Test
    void testGetAllPerformedTests() {
        int patientId = 1;

        PerformedTest performedTest = TestDataFactory.createPerformedTest();
        TestListRequest request = TestDataFactory.createTestListRequest();

        when(performedTestRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(performedTest));

        List<TestSummaryDTO> result = patientHistoryService.getAllPerformedTests(request, patientId);

        assertEquals(1, result.size());
        assertEquals(performedTest.getPerformedTestId(), result.getFirst().getPerformedTestId());
        assertEquals(performedTest.getTest().getTestName(), result.getFirst().getName());
        assertEquals(performedTest.getPrescription().getDoctor().getDoctorId(),
                result.getFirst().getOrderedBy().getDoctorId());
        assertEquals(performedTest.getTestDate(), result.getFirst().getDate());
        assertEquals(performedTest.getPrescription().getHospital().getName(),
                result.getFirst().getHospital().getName());
    }

     @Test
    void testGetAllPerformedTests_ReturnEmptyList() {
        int patientId = 1;

        TestListRequest request = TestDataFactory.createTestListRequest();

        when(performedTestRepository.findAll(any(Specification.class)))
                .thenReturn(Collections.emptyList());

        List<TestSummaryDTO> result = patientHistoryService.getAllPerformedTests(request, patientId);

        assertEquals(0, result.size());
        assertTrue(result.isEmpty());
    }

    /* test result */
    @Test
    void testGetTestResult_unauthorizedPatient() {
        int performedTestId = 1;
        int patientId = 1;

        when(performedTestRepository.patientIsAuthorized(performedTestId, patientId))
                .thenReturn(false);

        assertThrows(IllegalArgumentException.class, () ->
            patientHistoryService.getTestResult(performedTestId, patientId));
    }



    /* prescription details */
    @Test
    void testGetPrescriptionDetails_validInput_returnsCompleteDTO() {
        int prescriptionId = 1;
        int patientId = 1;

        Prescription prescription = TestDataFactory.createPrescription();

        when(prescriptionRepository.patientIsAuthorized(prescriptionId, patientId))
                .thenReturn(true);

        when(prescriptionRepository.findByPrescriptionId(prescriptionId))
                .thenReturn(Optional.of(prescription));

        when(prescribedMedicineRepository.findByPrescriptionId(prescriptionId))
                .thenReturn(List.of(TestDataFactory.createPrescribedMedicine()));

        when(diagnosedDiseaseRepository.findDiseaseNamesByPrescriptionId(prescriptionId))
                .thenReturn(List.of("Diabetes", "Hypertension"));

        when(prescribedTestRepository.findTestsByPrescriptionId(prescriptionId))
                .thenReturn(List.of("CBC", "Lipid Profile"));

        PrescriptionDTO dto = patientHistoryService.getPrescriptionDetails(prescriptionId, patientId);

        assertEquals("1", dto.getPrescriptionId());
        assertEquals(prescription.getDoctor().getDoctorId(), dto.getDoctor().getDoctorId());
        assertEquals("120/80", dto.getVitals().getBloodPressure().getValue());
        assertEquals("Diabetes", dto.getDiagnosis().getFirst());
        assertEquals("CBC", dto.getTests().getFirst());
        assertEquals("Napa", dto.getMedications().getFirst().getName());
    }


    @Test
    void testGetPrescriptionDetails_unauthorizedPatient() {
        int prescriptionId = 1;
        int patientId = 1;

        when(prescriptionRepository.patientIsAuthorized(prescriptionId, patientId))
                .thenReturn(true);


        assertThrows(IllegalArgumentException.class, () ->
            patientHistoryService.getPrescriptionDetails(1, 1));
    }

    @Test
    void testGetPrescriptionDetails_prescriptionNotFound_throwsException() {
        when(prescriptionRepository.findByPrescriptionId(1))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                patientHistoryService.getPrescriptionDetails(1, 1));
    }

    @Test
    void testGetAllPrescriptionsList_success() {
        // Given
        Integer patientId = 1;
        Prescription prescription = TestDataFactory.createPrescription();

        when(prescriptionRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(prescription));

        List<PrescriptionSummaryDTO> result = patientHistoryService
                .getPrescriptionSummaries(any(PrescriptionListRequest.class), patientId);

        assertEquals(1, result.size());
        assertEquals(1, result.getFirst().getPrescriptionId());
        assertEquals(prescription.getDoctor().getDoctorId(), result.getFirst().getDoctorId());
        assertEquals(prescription.getPrescribedDate(), result.getFirst().getIssuedDate());
        assertEquals(prescription.getSummary(), result.getFirst().getSummary());
    }

    @Test
    void testGetAllPrescriptionsList_emptyResult() {
        Integer patientId = 1;

        when(prescriptionRepository.findAll(any(Specification.class)))
                .thenReturn(Collections.emptyList());

        List<PrescriptionSummaryDTO> result = patientHistoryService
                .getPrescriptionSummaries(any(PrescriptionListRequest.class), patientId);

        assertTrue(result.isEmpty());
    }

}


