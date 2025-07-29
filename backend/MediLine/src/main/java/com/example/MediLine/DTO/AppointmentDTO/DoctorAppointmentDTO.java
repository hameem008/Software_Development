package com.example.MediLine.DTO.AppointmentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAppointmentDTO {
    private Integer appointmentId;
    private LocalDate date;
    private LocalTime time;
    private Integer patientId;
    private String patientName;
    private String patientEmail;
    private Integer hospitalId;
    private String hospitalName;
    private String hospitalAddress;
    private String chamber;
    private Integer serialNumber;
}
