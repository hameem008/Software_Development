package com.example.MediLine.DTO.AppointmentDTO;

import lombok.Data;

@Data
public class AppointmentWindowRequest {
    private int doctorId;
    private int medicalCenterId;
    private String weekDay;
}
