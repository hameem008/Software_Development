package com.example.MediLine;

import com.example.MediLine.Entity.*;
import com.example.MediLine.Entity.Symptom.SymptomId;
import com.example.MediLine.Entity.TestResultValue.TestResultKey;
import com.example.MediLine.Entity.TestParam.TestParamKey;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

public class TestDataFactory {

    public static Doctor createDoctor(int doctorId) {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        doctor.setFirstName("John");
        doctor.setLastName("Doe " + doctorId);
        doctor.setSpecialization("Cardiology");
        doctor.setDesignation("Professor");
        doctor.setAcademicInstitution("BSMMU");
        doctor.setAvailabilities(Set.of(createDoctorAvailability()));
        return doctor;
    }

    public static Hospital createHospital() {
        Hospital center = new Hospital();
        center.setHospitalId(1);
        center.setName("Apollo Hospital");
        center.setAddress("Dhaka, Bangladesh");
        return center;
    }

    public static DoctorAvailability createDoctorAvailability() {
        DoctorAvailability availability = new DoctorAvailability();
        availability.setSlotId(1);
        availability.setStartTime(LocalTime.of(10, 0));
        availability.setEndTime(LocalTime.of(14, 0));
        availability.setDuration(15);
        availability.setWeekDay("WEDNESDAY");
        availability.setVisitFee(500);
        availability.setHospital(createHospital());
        availability.setChamber("Room 101");
        return availability;
    }

    public static Patient createPatient() {
        Patient patient = new Patient();
        patient.setPatientId(1);
        patient.setFirstName("Alice");
        patient.setLastName("Smith");
        return patient;
    }

    public static Appointment createAppointment() {

        Appointment app = new Appointment();
        app.setAppointmentId(123);
        app.setSlot(createDoctorAvailability());
        app.setPatient(createPatient());
        app.setDate(LocalDate.of(2025, 8, 6));
        app.setTime(LocalTime.of(10, 30));
        app.setSerialNumber(5);

        DoctorAvailability availability = createDoctorAvailability();
        availability.setDoctor(createDoctor(1));
        app.setSlot(availability);

        return app;
    }

    public static DoctorReview createDoctorReview() {
        DoctorReview review = new DoctorReview();
        review.setRating(4);
        review.setDescription("Very good");
        review.setPatient(createPatient());
        review.setDate(LocalDate.of(2025, 6, 1));

        return  review;
    }

     private static Test createTest() {
        Test test = new Test();
        test.setId(1);
        test.setTestName("Complete blood count");
        return test;
    }

    public static PerformedTest createPerformedTest() {
        PerformedTest performedTest = new PerformedTest();
        performedTest.setPerformedTestId(1);
        performedTest.setTest(createTest());
        performedTest.setTestDate(LocalDate.now());
        performedTest.setPerformedByDoctor(createDoctor(2));
        performedTest.setReviewedByDoctor(createDoctor(3));
        performedTest.setHospital(createHospital());
        performedTest.setPrescription(createPrescription());
        return performedTest;
    }

    public static TestResultValue createTestResultValue() {
        TestResultValue testResultValue = new TestResultValue();
        TestResultKey key = new TestResultKey(1, "Hemoglobin");

        testResultValue.setId(key);
        testResultValue.setResultValue("13.5");
        testResultValue.setPerformedTest(createPerformedTest());
        return testResultValue;
    }

    public static TestParam createTestParam() {
        TestParamKey testParamKey = new TestParamKey(1, "Hemoglobin");
        TestParam param = new TestParam();

        param.setTest(createTest());
        param.setId(testParamKey);
        param.setUnit("g/dL");
        return param;
    }

    public static Prescription createPrescription() {
        Prescription prescription = new Prescription();
        prescription.setPrescriptionId(1);
        prescription.setDoctor(createDoctor(1));
        prescription.setPatient(createPatient());
        prescription.setHospital(createHospital());
        prescription.setBloodPressure("120/80");
        return prescription;
    }



    public static Symptom createSymptom() {
        Symptom symptom = new Symptom();
        symptom.setSymptomId(new SymptomId(1, LocalDate.now(), LocalTime.now()));
        symptom.setDescription("Sudden confusion and slurred speech");
        symptom.setOverallMood("Poor");
        symptom.setSeverityLevel(4);
        return symptom;
    }

    public static PrescribedMedicine createPrescribedMedicine() {
        Medicine medicine = new Medicine();
        medicine.setMedicineName("Napa");

        PrescribedMedicine prescribedMedicine = new PrescribedMedicine();

        prescribedMedicine.setMedicine(medicine);
        prescribedMedicine.setDosage("500mg");
        prescribedMedicine.setFrequency("2 times a day");
        prescribedMedicine.setDurationValue(5);
        prescribedMedicine.setDurationUnit("days");

        return prescribedMedicine;
    }

}
