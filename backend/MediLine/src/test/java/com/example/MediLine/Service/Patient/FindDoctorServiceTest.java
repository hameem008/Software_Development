package com.example.MediLine.Service.Patient;


import com.example.MediLine.DTO.FindDoctorDTO.DoctorCardDTO;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorDetailsDTO;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorReviewDTO;
import com.example.MediLine.DTO.FindDoctorDTO.FindDoctorRequest;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.DoctorAvailabilityRepository;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Repository.DoctorReviewRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


public class FindDoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private DoctorReviewRepository doctorReviewRepository;

    @Mock
    private DoctorAvailabilityRepository doctorAvailabilityRepository;

    @InjectMocks
    private FindDoctorService findDoctorService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSearchDoctors() {
        FindDoctorRequest request = new FindDoctorRequest();
        request.setSpecialization("Cardiology");
        request.setLocation("Dhaka");

        Doctor doctor = getDoctor();

        when(doctorRepository.searchDoctors("Cardiology", "Dhaka"))
                .thenReturn(List.of(doctor));
        when(doctorReviewRepository.findAverageRatingByDoctorId(1)).thenReturn(4.5);

        List<DoctorCardDTO> result = findDoctorService.searchDoctors(request);
        assertEquals(1, result.size());
        assertEquals("John Doe", result.getFirst().getName());
        assertEquals("Cardiology", result.getFirst().getSpecialization());
        assertEquals(4.5, result.getFirst().getRating());
    }

    private Doctor getDoctor() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);
        doctor.setFirstName("John");
        doctor.setLastName("Doe");
        doctor.setSpecialization("Cardiology");
        doctor.setDesignation("Professor");
        doctor.setAcademicInstitution("BSMMU");

        DoctorDegree degree = new DoctorDegree();
        DoctorDegree.DoctorDegreeId degreeId =
                new DoctorDegree.DoctorDegreeId(1,"MBBS");
        degree.setId(degreeId);
        degree.setInstitution("DU");
        degree.setPassingYear(2010);
        doctor.setDegrees(Set.of(degree));

        DoctorAvailability availability = new DoctorAvailability();
        availability.setWeekDay("Sunday");
        doctor.setAvailabilities(Set.of(availability));
        return doctor;
    }

    @Test
    void testGetDoctorDetails() {
        Doctor doctor = getDoctor();

        when(doctorRepository.findWithDegreesById(1))
                .thenReturn(Optional.of(doctor));

        MedicalCenter center = new MedicalCenter();
        center.setName("Apollo");
        center.setAddress("Dhaka");

        DoctorAvailability availability = new DoctorAvailability();
        availability.setWeekDay("Sunday");
        availability.setStartTime(LocalTime.of(9, 0));
        availability.setEndTime(LocalTime.of(12, 0));
        availability.setMedicalCenter(center);

        when(doctorAvailabilityRepository.findByDoctorDoctorId(1))
                .thenReturn(List.of(availability));
        when(doctorReviewRepository.findAverageRatingByDoctorId(1))
                .thenReturn(4.8);

        DoctorDetailsDTO details = findDoctorService.getDoctorDetails(1);
        assertEquals("John Doe", details.getName());
        assertEquals(1, details.getAvailableMedCenters().size());
        assertEquals(4.8, details.getRating());
    }

    @Test
    void testGetDoctorReviews() {
        Patient patient = new Patient();
        patient.setFirstName("Alice");
        patient.setLastName("Smith");

        DoctorReview review = new DoctorReview();
        review.setRating(4);
        review.setDescription("Very good");
        review.setPatient(patient);
        review.setDate(LocalDate.of(2025, 6, 1));

        when(doctorReviewRepository.findByDoctorDoctorId(1))
                .thenReturn(List.of(review));

        List<DoctorReviewDTO> reviews = findDoctorService.getDoctorReviews(1);
        assertEquals(1, reviews.size());
        assertEquals("Alice Smith", reviews.getFirst().getPatientName());
        assertEquals(4.0, reviews.getFirst().getRating());
        assertEquals("Very good", reviews.getFirst().getReviewText());
    }
}
