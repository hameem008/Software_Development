package com.example.MediLine.DTO.MedicalHistoryDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePrescriptionRequest {
    private Integer appointmentId;

    @NotNull
    private Integer patientId;

    @NotNull
    private Integer hospitalId;

    private String summary;

    private String bloodPressure;
    private BigDecimal weight;
    private Integer heartRate;

    private String symptoms;

    private List<@NotNull Integer> diagnosis;
    private List<@NotNull Integer> tests;
    private List<@Valid Medication> medications;

    private String notes;

    private LocalDate nextAppointment;
}