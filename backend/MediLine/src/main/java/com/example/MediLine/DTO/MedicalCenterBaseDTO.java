package com.example.MediLine.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalCenterBaseDTO {
    private Integer medicalCenterId;
    private String name;
    private String address;
}