package com.example.MediLine.DTO.FindDoctorDTO;

import lombok.Data;

@Data
public class FindDoctorRequest {
    private String specialization;
    private String location;
}
