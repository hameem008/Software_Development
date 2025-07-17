package com.example.MediLine.Service;

import com.example.MediLine.DTO.TestSaveRequest;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HospitalService {
    private final PrescriptionRepository prescriptionRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final TestRepository testRepository;
    private final PerformedTestRepository performedTestRepository;


    public void saveTest(TestSaveRequest testSaveRequest) {
        Hospital hospital = hospitalRepository.findById(testSaveRequest.getHospitalId())
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        Test test = testRepository.findById(testSaveRequest.getTestId())
                .orElseThrow();
        Doctor reviewedDoctor = doctorRepository.findById(testSaveRequest.getReviewed())
                .orElseThrow();

        Doctor performedDoctor = doctorRepository.findById(testSaveRequest.getReviewed())
                .orElseThrow();
      Prescription p = prescriptionRepository.findById(testSaveRequest.getPrescriptionId())
              .orElseThrow();

        PerformedTest performedTest = PerformedTest.builder()
                .prescription(p)
                .test(test)
                .reviewedByDoctor(reviewedDoctor)
                .performedByDoctor(performedDoctor)
                .testDate(testSaveRequest.getDate())
                .hospital(hospital)
                .build();

        performedTestRepository.save(performedTest);
    }
}
