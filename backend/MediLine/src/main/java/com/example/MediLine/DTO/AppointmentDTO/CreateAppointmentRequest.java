package com.example.MediLine.DTO.AppointmentDTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;


@Data
public class CreateAppointmentRequest {
    private Integer patientId;

    @NotNull(message = "Doctor ID is required")
    private Integer doctorId;

    @NotNull(message = "Slot ID is required")
    private Integer slotId;

    @NotNull(message = "Appointment Date is required")
    @FutureOrPresent(message = "Date must be today or in the future")
    private LocalDate date;

    @NotNull(message = "Time is required")
    @JsonFormat(pattern = "hh:mm a")
    private LocalTime time;
}
