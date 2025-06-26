package com.example.MediLine.DTO.FindDoctorDTO;


import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.DoctorDegreeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class DoctorCardDTO extends DoctorBaseDTO {
    private List<DoctorDegreeDTO> degrees;
    private List<String> availableDays;
    private double rating;
}
