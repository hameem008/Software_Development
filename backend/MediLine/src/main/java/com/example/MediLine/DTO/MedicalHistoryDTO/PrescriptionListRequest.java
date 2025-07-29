package com.example.MediLine.DTO.MedicalHistoryDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@Builder
public class PrescriptionListRequest {
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private Integer doctorId;
    private Integer diseaseId;
    private String keyword;
}

