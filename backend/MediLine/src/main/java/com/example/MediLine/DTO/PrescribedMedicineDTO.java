package com.example.MediLine.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescribedMedicineDTO {
    private Integer prescriptionId;
    private Integer medicineId;
    private String dosage;
    private String frequency;
    private Integer durationValue;
    private String durationUnit;
    private String instruction;
}