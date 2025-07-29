package com.example.MediLine.Controller.Hospital;

import com.example.MediLine.Annotation.CurrentHospital;
import com.example.MediLine.DTO.CreateTestRequest;
import com.example.MediLine.DTO.SaveTestResultRequest;
import com.example.MediLine.Entity.Hospital;
import com.example.MediLine.Service.Hospital.HospitalTestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
