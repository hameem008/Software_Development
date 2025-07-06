package com.example.MediLine.DTO.PatientAuthDTO;

import com.example.MediLine.DTO.AppointmentDTO.AppointmentDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.Medication;
import com.example.MediLine.DTO.MedicalHistoryDTO.PendingTestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDashboardDTO {
    private LocalDate nextAppointment;
    private List<Medication> todaysMedications;
    private List<AppointmentDTO> upcomingAppointments;
    private List<WeightEntry> recentWeights;
    private List<BloodPressureDTO> recentBloodPressures;
    private List<HeartRateDTO> recentHeartRates;
    private List<PendingTestDTO> pendingSuggestedTests;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WeightEntry {
        private LocalDate date;
        private double weight;
        private String unit;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BloodPressureDTO {
        private LocalDate date;
        private double lowerPressure;
        private double upperPressure;
        private String unit;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HeartRateDTO {
        private LocalDate date;
        private int heartRate;
        private String unit;
    }
}
