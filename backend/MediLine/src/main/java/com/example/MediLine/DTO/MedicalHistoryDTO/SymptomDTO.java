package com.example.MediLine.DTO.MedicalHistoryDTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SymptomDTO {
    private String description;

    private LocalDate date;

    @JsonFormat(pattern = "hh:mm a")
    private LocalTime time;

    private String overallMood;
    private int severityLevel;
}
