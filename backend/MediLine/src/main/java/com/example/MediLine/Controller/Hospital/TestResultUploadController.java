package com.example.MediLine.Controller.Hospital;

import com.example.MediLine.Annotation.CurrentDoctor;
import com.example.MediLine.DTO.AppointmentDTO.DoctorAppointmentDTO;
import com.example.MediLine.DTO.TestSaveRequest;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospital")
@RequiredArgsConstructor
public class TestResultUploadController {
    private final HospitalService hospitalService;

    @PostMapping("/test-upload")
    public ResponseEntity<String> saveTestResult(
            @RequestBody TestSaveRequest testSaveRequest) {

        System.out.println("0----" + testSaveRequest.getTestId());
        System.out.println("0----" + testSaveRequest.getPrescriptionId());
        System.out.println("0----" + testSaveRequest.getReviewed());
        System.out.println("0----" + testSaveRequest.getDate());
        System.out.println("0----" + testSaveRequest.getNote());

        hospitalService
                .saveTest(testSaveRequest);

        return ResponseEntity.ok("successful");
    }
}
