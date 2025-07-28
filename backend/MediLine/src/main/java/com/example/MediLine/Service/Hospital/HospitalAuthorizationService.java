package com.example.MediLine.Service.Hospital;

import com.example.MediLine.Repository.TestRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HospitalAuthorizationService {
    private final TestRequestRepository testRepository;

    public void checkAuthorizationToTestRequest(int hospitalId, int testRequestId) {
        if (!testRepository.hospitalIsAuthorized(hospitalId, testRequestId)) {
            throw new IllegalArgumentException("Hospital is not authorized to access this test request");
        }
    }
}
