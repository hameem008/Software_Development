package com.example.MediLine.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class DoctorBaseDTO {
    @NotNull
    private int doctorId;

    @NotBlank
    private String name;

    @NotBlank
    private String specialization;

    @NotBlank
    private String designation;

    @NotBlank
    private String academicInstitution;
}


