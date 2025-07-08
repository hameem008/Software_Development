package com.example.MediLine.Service.Patient;


import com.example.MediLine.DTO.FindDoctorDTO.DoctorCardDTO;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorDetailsDTO;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorReviewDTO;
import com.example.MediLine.DTO.FindDoctorDTO.FindDoctorRequest;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.DoctorAvailabilityRepository;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Repository.DoctorReviewRepository;

import com.example.MediLine.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

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


    private Doctor doctor;


    @BeforeEach
    public void setUp() {

        MockitoAnnotations.openMocks(this);

        doctor = TestDataFactory.createDoctor(1);
    }

    @Test
    void testSearchDoctors() {
        FindDoctorRequest request = new FindDoctorRequest();
        request.setSpecialization("Cardiology");
        request.setLocation("Dhaka");

        when(doctorRepository.searchDoctors("Cardiology", "Dhaka"))
                .thenReturn(List.of(doctor));
        when(doctorReviewRepository.findAverageRatingByDoctorId(1)).thenReturn(4.5);

        List<DoctorCardDTO> result = findDoctorService.searchDoctors(request);
        assertEquals(1, result.size());
        assertEquals(doctor.getFirstName() + " " + doctor.getLastName(),
                result.getFirst().getName());
        assertEquals("Cardiology", result.getFirst().getSpecialization());
        assertEquals(4.5, result.getFirst().getRating());
    }


    @Test
    void testGetDoctorDetails() {
        when(doctorRepository.findWithDegreesById(1))
                .thenReturn(Optional.of(doctor));

        DoctorAvailability availability = TestDataFactory.createDoctorAvailability();

        when(doctorAvailabilityRepository.findByDoctorDoctorId(1))
                .thenReturn(List.of(availability));
        when(doctorReviewRepository.findAverageRatingByDoctorId(1))
                .thenReturn(4.8);

        DoctorDetailsDTO details = findDoctorService.getDoctorDetails(1);
        assertEquals(doctor.getFirstName() + " " + doctor.getLastName(),
                details.getName());
        assertEquals(1, details.getAvailableMedCenters().size());
        assertEquals("Apollo Hospital",
                details.getAvailableMedCenters().getFirst().getHospitalName());
        assertEquals(4.8, details.getRating());
    }

    @Test
    void testGetDoctorDetails_whenNoDoctor() {
        when(doctorRepository.findWithDegreesById(1))
                .thenReturn(Optional.empty());

        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> findDoctorService.getDoctorDetails(1));
        assertTrue(ex.getMessage().contains("Doctor not found"));
    }

    @Test
    void testGetDoctorDetails_whenNoAvailability() {
        when(doctorRepository.findWithDegreesById(1))
                .thenReturn(Optional.of(doctor));

        // No availability
        when(doctorAvailabilityRepository.findByDoctorDoctorId(1))
                .thenReturn(Collections.emptyList());

        when(doctorReviewRepository.findAverageRatingByDoctorId(1))
                .thenReturn(4.8);

        DoctorDetailsDTO details = findDoctorService.getDoctorDetails(1);

        assertEquals(doctor.getFirstName() + " " + doctor.getLastName(),
                details.getName());
        assertTrue(details.getAvailableMedCenters().isEmpty());
        assertEquals(4.8, details.getRating());
    }

    @Test
    void testGetDoctorDetails_whenNoRating() {
        when(doctorRepository.findWithDegreesById(1))
                .thenReturn(Optional.of(doctor));

        DoctorAvailability availability = TestDataFactory.createDoctorAvailability();

        when(doctorAvailabilityRepository.findByDoctorDoctorId(1))
                .thenReturn(List.of(availability));

        // No rating available
        when(doctorReviewRepository.findAverageRatingByDoctorId(1))
                .thenReturn(null);

        DoctorDetailsDTO details = findDoctorService.getDoctorDetails(1);

        assertEquals(doctor.getFirstName() + " " + doctor.getLastName(),
                details.getName());
        assertEquals(1, details.getAvailableMedCenters().size());
        assertEquals(0, details.getRating());
    }


    @Test
    void testGetDoctorReviews() {
        DoctorReview review = TestDataFactory.createDoctorReview();

        when(doctorReviewRepository.findByDoctorDoctorId(1))
                .thenReturn(List.of(review));

        List<DoctorReviewDTO> reviews = findDoctorService.getDoctorReviews(1);
        assertEquals(1, reviews.size());
        assertEquals("Alice Smith", reviews.getFirst().getPatientName());
        assertEquals(4.0, reviews.getFirst().getRating());
        assertEquals("Very good", reviews.getFirst().getReviewText());
    }


    @Test
    void testGetDoctorReviews_whenNoReviews() {
        when(doctorReviewRepository.findByDoctorDoctorId(1))
                .thenReturn(Collections.emptyList());

        List<DoctorReviewDTO> reviews = findDoctorService.getDoctorReviews(1);
        assertEquals(0, reviews.size());
    }
}
