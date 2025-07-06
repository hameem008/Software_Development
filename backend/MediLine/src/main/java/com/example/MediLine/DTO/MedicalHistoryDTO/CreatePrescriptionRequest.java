package com.example.MediLine.DTO.MedicalHistoryDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePrescriptionRequest {
    @NotBlank
    private String patientId;

    @NotBlank
    private String summary;

    @NotNull
    private Vitals vitals;

    @NotEmpty
    private List<@NotBlank String> symptoms;

    @NotEmpty
    private List<@NotBlank String> diagnosis;

    @NotEmpty
    private List<@Valid Medication> medications;

    private String notes;

    @NotNull
    private LocalDate nextAppointment;
}