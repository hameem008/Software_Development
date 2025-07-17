package com.example.MediLine.DTO.MedicalHistoryDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DoctorPrescriptionListRequest {
    @NotNull
    private Integer patientId;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private Integer doctorId;
    private Integer diseaseId;
    private String keyword;
}
