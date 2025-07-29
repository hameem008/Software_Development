package com.example.MediLine.DTO.MedicalHistoryDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestListRequest {
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private Integer testId;
}
