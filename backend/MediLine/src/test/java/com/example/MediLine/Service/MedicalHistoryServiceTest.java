package com.example.MediLine.Service;

import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.HospitalBaseDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.Medication;
import com.example.MediLine.DTO.MedicalHistoryDTO.TestResultDTO;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.*;
import com.example.MediLine.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class MedicalHistoryServiceTest {
    @Mock private PerformedTestRepository performedTestRepository;
    @Mock private TestResultValueRepository testResultValueRepository;
    @Mock private TestParamRepository testParamRepository;

    @InjectMocks private MedicalHistoryService medicalHistoryService;

     @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    /* doctor base DTO test */
    @Test
    void testCreateDoctorBaseDTO_withValidDoctor() {
        Doctor doctor = TestDataFactory.createDoctor(1);

        DoctorBaseDTO dto = medicalHistoryService.createDoctorBaseDTO(doctor);

        assertNotNull(dto);
        assertEquals(doctor.getDoctorId(), dto.getDoctorId());
        assertEquals(doctor.getFirstName() + " " + doctor.getLastName(), dto.getName());
        assertEquals(doctor.getSpecialization(), dto.getSpecialization());
        assertEquals(doctor.getDesignation(), dto.getDesignation());
        assertEquals(doctor.getAcademicInstitution(), dto.getAcademicInstitution());
    }

    @Test
    void testCreateDoctorBaseDTO_withNullDoctor_returnsNull() {
        DoctorBaseDTO dto = medicalHistoryService.createDoctorBaseDTO(null);
        assertNull(dto);
    }
    
    /* hospital base DTO test */
    @Test
    void testCreateHospitalBaseDTO_withValidHospital() {
        Hospital hospital = TestDataFactory.createHospital();

        HospitalBaseDTO dto = medicalHistoryService.createHospitalBaseDTO(hospital);

        assertNotNull(dto);
        assertEquals(hospital.getHospitalId(), dto.getHospitalId());
        assertEquals(hospital.getName(), dto.getName());
        assertEquals(hospital.getAddress(), dto.getAddress());
    }

    @Test
    void testCreateHospitalBaseDTO_withNullHospital_returnsNull() {

        HospitalBaseDTO dto = medicalHistoryService.createHospitalBaseDTO(null);
        assertNull(dto);
    }

    /* medication test */
    @Test
    void testCreateMedicationDTO_withValidPrescribedMedicine() {
        PrescribedMedicine prescribedMedicine =
                TestDataFactory.createPrescribedMedicine();
        
        Medication medication =
                medicalHistoryService.createMedicationDTO(prescribedMedicine);

        assertNotNull(medication);
        assertEquals("Napa", medication.getName());
        assertEquals("500mg", medication.getDosage());
        assertEquals("2 times a day", medication.getFrequency());
        assertEquals(5, medication.getDurationValue());
        assertEquals("days", medication.getDurationUnit());
    }

    @Test
    void testCreateMedicationDTO_withNullPrescribedMedicine_returnsNull() {
        Medication medication = medicalHistoryService.createMedicationDTO(null);
        assertNull(medication);
    }

    /* medical-test result test */
    @Test
    void getPerformedTest_validTestAndPatient_returnsPerformedTest() {
        PerformedTest test = TestDataFactory.createPerformedTest();
        when(performedTestRepository.findByPerformedTestId(1))
            .thenReturn(Optional.of(test));

        PerformedTest result = medicalHistoryService.getPerformedTest(1);

        assertNotNull(result);
        assertEquals(test.getTest().getTestName(), result.getTest().getTestName());
        assertEquals(test.getTestDate(), result.getTestDate());
        assertEquals(test.getPrescription().getPrescriptionId(),
                result.getPrescription().getPrescriptionId());
        assertEquals(test.getHospital().getHospitalId(), result.getHospital().getHospitalId());
    }

    @Test
    void getPerformedTest_invalidTest_throwsException() {
        when(performedTestRepository.findById(1))
            .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
            medicalHistoryService.getPerformedTest(1)
        );
    }

    @Test
    void mapTestResults_validValuesAndParams_mapsCorrectly() {
        PerformedTest performedTest = TestDataFactory.createPerformedTest();
        TestParam testParam = TestDataFactory.createTestParam();
        TestResultValue testResultValue = TestDataFactory.createTestResultValue();


         when(testResultValueRepository.findByPerformedTestId(1))
                .thenReturn(List.of(testResultValue));

         when(testParamRepository.findByTestId(1))
                .thenReturn(List.of(testParam));

        List<TestResultDTO.ResultEntry> results = medicalHistoryService
                .getTestResultValues(performedTest);

        TestResultDTO.ResultEntry entry = results.getFirst();

        assertEquals(1, results.size());
        assertEquals("Hemoglobin", entry.getName());
        assertEquals("13.5", entry.getValue());
        assertEquals("g/dL", entry.getUnit());
    }

    @Test
    void testBuildTestResultDTO_validTest_buildsCorrectDTO() {
        PerformedTest test = TestDataFactory.createPerformedTest();
        List<TestResultDTO.ResultEntry> entries = List.of(TestResultDTO.ResultEntry.builder()
                .name("Hemoglobin")
                .value("13.5")
                .unit("g/dL")
                .build());

        TestResultDTO dto = medicalHistoryService.createTestResultDTO(test, entries);

        assertEquals(test.getPerformedTestId(), dto.getPerformedTestId());
        assertEquals("Hemoglobin", dto.getResults().getFirst().getName());
        assertEquals("13.5", dto.getResults().getFirst().getValue());
        assertEquals(test.getPrescription().getDoctor().getDoctorId(), dto.getOrderedBy().getDoctorId());
        assertEquals(test.getPerformedByDoctor().getDoctorId(), dto.getPerformedBy().getDoctorId());
        assertEquals(test.getReviewedByDoctor().getDoctorId(), dto.getReviewedBy().getDoctorId());
        assertEquals(test.getHospital().getHospitalId(), dto.getHospital().getHospitalId());
    }


}
