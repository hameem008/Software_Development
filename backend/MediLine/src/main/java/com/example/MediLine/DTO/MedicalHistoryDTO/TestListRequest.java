package com.example.MediLine.DTO.MedicalHistoryDTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TestListRequest {
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private Integer testId;
}
