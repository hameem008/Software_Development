package com.example.MediLine;

import com.example.MediLine.Entity.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

public class TestDataFactory {

    public static Doctor createDoctor() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);
        doctor.setFirstName("John");
        doctor.setLastName("Doe");
        doctor.setSpecialization("Cardiology");
        doctor.setDesignation("Professor");
        doctor.setAcademicInstitution("BSMMU");
        doctor.setAvailabilities(Set.of(createDoctorAvailability()));
        return doctor;
    }

    public static MedicalCenter createMedicalCenter() {
        MedicalCenter center = new MedicalCenter();
        center.setMedicalCenterId(1);
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
        availability.setMedicalCenter(createMedicalCenter());
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
        availability.setDoctor(createDoctor());
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

}
