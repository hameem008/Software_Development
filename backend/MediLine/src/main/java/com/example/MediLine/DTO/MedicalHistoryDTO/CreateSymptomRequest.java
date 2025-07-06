package com.example.MediLine.DTO.MedicalHistoryDTO;


import jakarta.validation.constraints.*;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSymptomRequest {
    @NotBlank
    private String description;

    @NotBlank
    private String overallMood;

    @Min(1)
    @Max(5)
    private int severityLevel;
}
