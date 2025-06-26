package com.example.MediLine.DTO.AppointmentDTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppointmentDTO {
    @NotNull
    private int appointmentId;

    @NotNull
    private int doctorId;

    @NotNull
    private String doctorName;

    @NotNull
    private int medicalCenterId;

    @NotNull
    private String medicalCenterName;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime time;

    private String chamber;

    @NotNull
    private int serialNumber;
}
