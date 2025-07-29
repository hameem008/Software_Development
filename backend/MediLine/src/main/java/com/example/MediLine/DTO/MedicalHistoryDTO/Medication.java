package com.example.MediLine.DTO.MedicalHistoryDTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Medication {
    @NotNull
    private Integer medicineId;

    @NotBlank
    private String name;

    private String dosage;

    @NotBlank
    private String frequency;

    @NotNull
    private Integer durationValue;

    @NotBlank
    private String durationUnit;

    private String instructions;
}
