package com.example.MediLine.Service.Patient;

import com.example.MediLine.DTO.DoctorDegreeDTO;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorCardDTO;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorDetailsDTO;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorReviewDTO;
import com.example.MediLine.DTO.FindDoctorDTO.FindDoctorRequest;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Entity.DoctorAvailability;
import com.example.MediLine.Entity.DoctorReview;
import com.example.MediLine.Entity.MedicalCenter;
import com.example.MediLine.Repository.DoctorAvailabilityRepository;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Repository.DoctorReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindDoctorService {
    private final DoctorRepository doctorRepository;

    private final DoctorReviewRepository doctorReviewRepository;

    private final DoctorAvailabilityRepository doctorAvailabilityRepository;


    public List<DoctorCardDTO> searchDoctors(FindDoctorRequest findDoctorRequest) {
        List<Doctor> doctors = doctorRepository.searchDoctors(
                findDoctorRequest.getSpecialization(), findDoctorRequest.getLocation());

        return doctors.stream().map(doctor -> DoctorCardDTO.builder()
                .doctorId(doctor.getDoctorId())
                .name(doctor.getFirstName() + " " + doctor.getLastName())
                .specialization(doctor.getSpecialization())
                .designation(doctor.getDesignation())
                .academicInstitution(doctor.getAcademicInstitution())
                .degrees(doctor.getDegrees().stream()
                        .map(degree -> new DoctorDegreeDTO(
                                degree.getId().getDegreeName(),
                                degree.getInstitution(),
                                degree.getPassingYear()))
                        .toList())
                .availableDays(
                        doctor.getAvailabilities().stream()
                                .map(DoctorAvailability::getWeekDay)
                                .distinct()
                                .toList()
                )
                .rating(
                        doctorReviewRepository.findAverageRatingByDoctorId(doctor.getDoctorId())
                )
                .build()
        ).collect(Collectors.toList());
    }

    public DoctorDetailsDTO getDoctorDetails(int doctorId) {
        Doctor doctor = doctorRepository.findWithDegreesById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));


        List<DoctorAvailability> doctorAvailabilities =
                doctorAvailabilityRepository.findByDoctorDoctorId(doctorId);

        return DoctorDetailsDTO.builder()
                .doctorId(doctor.getDoctorId())
                .name(doctor.getFirstName() + " " + doctor.getLastName())
                .specialization(doctor.getSpecialization())
                .designation(doctor.getDesignation())
                .academicInstitution(doctor.getAcademicInstitution())
                .degrees(doctor.getDegrees().stream()
                        .map(degree -> new DoctorDegreeDTO(
                                degree.getId().getDegreeName(),
                                degree.getInstitution(),
                                degree.getPassingYear()))
                        .toList())
                .availableMedCenters(
                        createMedCenterList(doctorAvailabilities))
                .rating(
                        doctorReviewRepository.findAverageRatingByDoctorId(doctorId))
                .build();
    }

    public List<DoctorReviewDTO> getDoctorReviews(int doctorId) {
        List<DoctorReview> reviews = doctorReviewRepository.findByDoctorDoctorId(doctorId);

        return reviews.stream()
                .map(review -> DoctorReviewDTO.builder()
                    .patientName(
                            review.getPatient().getFirstName() + " " + review.getPatient().getLastName())
                    .rating(review.getRating())
                    .reviewText(review.getDescription())
                    .date(review.getDate())
                    .build())
                .toList();
    }


    private List<DoctorDetailsDTO.AvailableMedCenters> createMedCenterList(
            List<DoctorAvailability> availabilities) {

        Map<MedicalCenter, List<DoctorAvailability>> grouped = availabilities.stream()
                .collect(Collectors.groupingBy(DoctorAvailability::getMedicalCenter));

        return grouped.entrySet().stream()
                .map(entry ->
                        new DoctorDetailsDTO.AvailableMedCenters(
                            entry.getKey().getName(),
                            entry.getKey().getAddress(),
                            entry.getValue().stream()
                                    .map(availability -> new DoctorDetailsDTO.AvailabilitySlot(
                                            availability.getWeekDay(),
                                            availability.getStartTime(),
                                            availability.getEndTime()))
                                    .toList()
                        )
                )
                .toList();
    }


}
