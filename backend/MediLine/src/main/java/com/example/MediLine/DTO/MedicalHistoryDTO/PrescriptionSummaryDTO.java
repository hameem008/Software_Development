package com.example.MediLine.DTO.MedicalHistoryDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionSummaryDTO {
    private int prescriptionId;
    private String doctorName;
    private int doctorId;
    private LocalDate issuedDate;
    private String summary;
}
