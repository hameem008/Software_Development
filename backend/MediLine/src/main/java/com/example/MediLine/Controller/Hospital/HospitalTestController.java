package com.example.MediLine.Controller.Hospital;

import com.example.MediLine.Annotation.CurrentHospital;
import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.PatientHistoryRequest;
import com.example.MediLine.DTO.PatientInfoDTO;
import com.example.MediLine.DTO.TestUploadDTO.CreateTestRequest;
import com.example.MediLine.DTO.TestUploadDTO.SaveTestResultRequest;
import com.example.MediLine.DTO.TestUploadDTO.TestParamsDTO;
import com.example.MediLine.DTO.TestUploadDTO.TestRequestId;
import com.example.MediLine.Entity.Hospital;
import com.example.MediLine.Service.Hospital.HospitalTestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospital/test")
@RequiredArgsConstructor
public class HospitalTestController {
    private final HospitalTestService hospitalTestService;


    @PostMapping("/create-test-request")
    public ResponseEntity<String> createTestRequest(
            @RequestBody @Valid
            CreateTestRequest createTestRequest,
            @CurrentHospital Hospital hospital) {

        hospitalTestService.createTestRequest(createTestRequest, hospital);

        return ResponseEntity.ok("successfully added test request");
    }

    @PostMapping("/result-upload")
    public ResponseEntity<String> saveTestResult(
            @RequestBody @Valid
            SaveTestResultRequest saveTestResultRequest,
            @CurrentHospital Hospital hospital) {

        hospitalTestService.saveTest(saveTestResultRequest, hospital.getHospitalId());

        return ResponseEntity.ok("successfully uploaded test result");
    }

    @PostMapping("/patient-info")
    public ResponseEntity<PatientInfoDTO> getPatientInfo(
            @RequestBody PatientHistoryRequest patientRequest) {

        PatientInfoDTO patientInfo = hospitalTestService
                .getPatientInfo(patientRequest.getPatientId());

        return ResponseEntity.ok(patientInfo);
    }

    @GetMapping("/all-doctors")
    public ResponseEntity<List<IdNameDTO>> getAllDoctorNames() {

        List<IdNameDTO> allDoctorNames = hospitalTestService.getAllDoctors();

        if (allDoctorNames.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(allDoctorNames);
    }

    @PostMapping("/test-params")
    public ResponseEntity<TestParamsDTO> getTestParameters(@RequestBody TestRequestId testRequestId) {

        TestParamsDTO testParams = hospitalTestService
                .getTestParams(testRequestId.getTestRequestId());

        return ResponseEntity.ok(testParams);
    }
}
