package com.example.MediLine.DTO.MedicalHistoryDTO;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeverityLevelDTO {
    private int severityLevel;
    private String description;
}
