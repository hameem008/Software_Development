package com.example.MediLine.DTO.FindDoctorDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@Builder
public class DoctorReviewDTO {
    private String patientName;
    private String reviewText;
    private int rating;
    private LocalDate date;
}
