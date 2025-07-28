package com.example.MediLine.Service.Doctor;

import com.example.MediLine.DTO.MedicalHistoryDTO.DoctorPrescriptionListRequest;
import com.example.MediLine.DTO.MedicalHistoryDTO.DoctorTestListRequest;
import com.example.MediLine.Service.MedicalHistoryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verifyNoInteractions;


@ExtendWith(MockitoExtension.class)
public class DoctorMedicalHistoryServiceTest {
    @Mock private MedicalHistoryService medicalHistoryService;
    @Mock private DoctorAuthorizationService doctorAuthorizationService;

    @InjectMocks
    private DoctorMedicalHistoryService doctorMedicalHistoryService;

    @Test
    void testGetPatientsSymptoms_unauthorized() {
        Integer patientId = 1;
        Integer doctorId = 100;

        doThrow(new IllegalArgumentException("Access denied"))
                .when(doctorAuthorizationService)
                .checkDoctorsAccessToPatient(doctorId, patientId);

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                doctorMedicalHistoryService.getPatientsSymptoms(patientId, doctorId)
        );

        assertEquals("Access denied", ex.getMessage());
        verifyNoInteractions(medicalHistoryService);
    }

    @Test
    void testGetPatientsAllTestsList_unauthorized() {
        Integer patientId = 1;
        Integer doctorId = 100;

        DoctorTestListRequest request = new DoctorTestListRequest();
        request.setPatientId(patientId);

        doThrow(new IllegalArgumentException("Access denied"))
                .when(doctorAuthorizationService)
                .checkDoctorsAccessToPatient(doctorId, patientId);

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                doctorMedicalHistoryService.getPatientsAllTestsList(request, doctorId)
        );

        assertEquals("Access denied", ex.getMessage());
        verifyNoInteractions(medicalHistoryService);
    }

    @Test
    void testGetPatientsTestsResult_unauthorized() {
        Integer performedTestId = 1;
        Integer doctorId = 100;

        doThrow(new IllegalArgumentException("Access denied"))
                .when(doctorAuthorizationService)
                .checkDoctorsAccessToTestResult(doctorId, performedTestId);

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                doctorMedicalHistoryService
                        .getPatientsTestResultDetails(performedTestId, doctorId)
        );

        assertEquals("Access denied", ex.getMessage());
        verifyNoInteractions(medicalHistoryService);
    }


    @Test
    void testGetPatientsAllPrescriptions_unauthorized() {
        Integer patientId = 1;
        Integer doctorId = 100;

        DoctorPrescriptionListRequest request = new DoctorPrescriptionListRequest();
        request.setPatientId(patientId);

        doThrow(new IllegalArgumentException("Access denied"))
                .when(doctorAuthorizationService)
                .checkDoctorsAccessToPatient(doctorId, patientId);

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                doctorMedicalHistoryService.getPatientsAllPrescriptions(request, doctorId)
        );

        assertEquals("Access denied", ex.getMessage());
        verifyNoInteractions(medicalHistoryService);
    }

    @Test
    void testGetPatientsPrescription_unauthorized() {
        Integer prescriptionId = 1;
        Integer doctorId = 100;

        doThrow(new IllegalArgumentException("Access denied"))
                .when(doctorAuthorizationService)
                .checkDoctorsAccessToPrescription(doctorId, prescriptionId);

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                doctorMedicalHistoryService
                        .getPatientsPrescription(prescriptionId, doctorId)
        );

        assertEquals("Access denied", ex.getMessage());
        verifyNoInteractions(medicalHistoryService);
    }
}
