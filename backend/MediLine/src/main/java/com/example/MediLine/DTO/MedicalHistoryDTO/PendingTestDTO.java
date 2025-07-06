package com.example.MediLine.DTO.MedicalHistoryDTO;

import com.example.MediLine.DTO.DoctorBaseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingTestDTO {
    private Integer testId;
    private String testName;
    private Integer prescriptionId;
    private DoctorBaseDTO orderedBy;
    private LocalDate date;
}
