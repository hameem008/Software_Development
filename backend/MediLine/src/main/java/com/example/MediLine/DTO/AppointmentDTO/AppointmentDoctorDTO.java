package com.example.MediLine.DTO.AppointmentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDoctorDTO {
    private int doctorId;
    private String name;
    private String specialization;
    private String designation;
    private String academicInstitution;
    private List<String> availableWeekdays;
    private List<ConsultationLocation> consultationLocations;

    @Data
    @AllArgsConstructor
    @Builder
    public static class ConsultationLocation {
        private int medicalCenterId;
        private String medicalCenterName;
        private String medicalCenterLocation;
        private double consultationFee;
    }
}
