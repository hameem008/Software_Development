package com.example.MediLine.DTO.MedicalHistoryDTO;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TestResultRequest {
    @Positive
    private Integer performedTestId;
}
