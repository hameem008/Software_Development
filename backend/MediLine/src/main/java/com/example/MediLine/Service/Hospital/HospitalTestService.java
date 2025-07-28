package com.example.MediLine.Service.Hospital;

import com.example.MediLine.DTO.CreateTestRequest;
import com.example.MediLine.DTO.SaveTestResultRequest;
import com.example.MediLine.DTO.SaveTestResultRequest.ResultEntry;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Entity.TestResultValue.TestResultKey;
import com.example.MediLine.Entity.TestRequest.TestRequestStatus;
import com.example.MediLine.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class HospitalTestService {
    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final DoctorRepository doctorRepository;
    private final TestRepository testRepository;
    private final PerformedTestRepository performedTestRepository;
    private final TestRequestRepository testRequestRepository;
    private final HospitalAuthorizationService hospitalAuthorizationService;
    private final TestParamRepository testParamRepository;


    @Transactional
    public void createTestRequest(CreateTestRequest createTestRequest, Hospital hospital) {
        Patient patient = patientRepository.findById(Long.valueOf(createTestRequest.getPatientId()))
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        Test test = testRepository.findById(createTestRequest.getTestId())
                .orElseThrow(() -> new IllegalArgumentException("Test not found"));

        Prescription prescription = null;
        if (createTestRequest.getPrescriptionId() != null) {
            prescription = prescriptionRepository.findById(createTestRequest.getPrescriptionId())
                    .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));
        }

        TestRequest testRequest = TestRequest.builder()
                .test(test)
                .patient(patient)
                .prescription(prescription)
                .status(TestRequestStatus.Pending)
                .requestedDate(LocalDate.now())
                .hospital(hospital)
                .build();

        testRequestRepository.save(testRequest);
    }

    @Transactional
    public void saveTest(SaveTestResultRequest saveTestResultRequest, Integer hospitalId) {
        TestRequest testRequest = testRequestRepository
                .findByTestRequestIdAndStatus(
                        saveTestResultRequest.getRequestId(),
                        TestRequestStatus.Pending)
                .orElseThrow(() -> new IllegalArgumentException("Test request not found"));

        System.out.println("checking authorization..................................");
        hospitalAuthorizationService.checkAuthorizationToTestRequest(
                saveTestResultRequest.getRequestId(),
                hospitalId
        );

        validateResultParameters(
                testRequest.getTest().getId(),
                saveTestResultRequest.getResultEntries()
        );

        System.out.println("checking authorization Done ...................");


        Doctor reviewedDoctor = doctorRepository.findById(saveTestResultRequest.getReviewedDoctorID())
                .orElseThrow(() -> new IllegalArgumentException("Reviewed doctor not found"));

        Doctor performedDoctor = doctorRepository.findById(saveTestResultRequest.getPerformedDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Performed doctor request not found"));


        PerformedTest performedTest = createPerformedTestEntity(
                testRequest, performedDoctor, reviewedDoctor
        );

        System.out.println("performed test created..................................");

        Set<TestResultValue> testResultValues = createTestResultValueEntity(
                saveTestResultRequest.getResultEntries(), performedTest
        );

        System.out.println("test result values created ..................................");

        performedTest.setResultValues(testResultValues);
        performedTest.setNote(saveTestResultRequest.getNote());

        System.out.println("setting everything ..................................");

        performedTestRepository.save(performedTest);

        System.out.println("uploaded..................................");

        testRequest.setStatus(TestRequestStatus.Complete);

        System.out.println("done ..................................");
    }

    private PerformedTest createPerformedTestEntity(
            TestRequest testRequest, Doctor performedDoctor, Doctor reviewedDoctor) {

        return PerformedTest.builder()
                .test(testRequest.getTest())
                .prescription(testRequest.getPrescription())
                .performedByDoctor(performedDoctor)
                .reviewedByDoctor(reviewedDoctor)
                .testDate(LocalDate.now())
                .hospital(testRequest.getHospital())
                .build();
    }


    private Set<TestResultValue> createTestResultValueEntity(
            List<ResultEntry> resultValues, PerformedTest performedTest) {

        return resultValues.stream().map(resultValue -> {
            TestResultKey testResultKey = new TestResultKey();
            testResultKey.setParameterName(resultValue.getName());

            TestResultValue testResultValue = new TestResultValue();
            testResultValue.setId(testResultKey);
            testResultValue.setResultValue(resultValue.getValue());
            testResultValue.setPerformedTest(performedTest);

            return testResultValue;
        }).collect(Collectors.toSet());
    }

    private void validateResultParameters(Integer testId, List<ResultEntry> resultEntries) {
        List<String> expectedParameters = getTestParameterNames(testId);

        List<String> requestParameters = resultEntries.stream()
                .map(ResultEntry::getName)
                .toList();

        if(!expectedParameters.equals(requestParameters)) {
            throw new IllegalArgumentException("Invalid parameters in the request");
        }
    }

    public List<String> getTestParameterNames(Integer testId) {
        List<TestParam> testParams = testParamRepository.findByTestId(testId);

        return testParams.stream()
                .map(param -> param.getId().getParameterName())
                .collect(Collectors.toList());
    }
}
