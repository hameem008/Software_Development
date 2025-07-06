package com.example.MediLine.DTO.MedicalHistoryDTO;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientHistoryRequest {
    @Positive
    private Integer patientId;
}
