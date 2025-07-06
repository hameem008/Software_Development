package com.example.MediLine.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorDegreeDTO {
    private String degree;
    private String institution;
    private int year;
}
