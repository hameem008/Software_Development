package com.example.MediLine.DTO.AppointmentDTO;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AppointmentWindowRequest {
    @Positive
    private Integer doctorId;

    @Positive
    private Integer hospitalId;

    @FutureOrPresent
    private LocalDate date;
}
