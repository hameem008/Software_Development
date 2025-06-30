package com.example.MediLine.DTO.MedicalHistoryDTO;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionRequest {
    @Positive
    private Integer prescriptionId;
}
