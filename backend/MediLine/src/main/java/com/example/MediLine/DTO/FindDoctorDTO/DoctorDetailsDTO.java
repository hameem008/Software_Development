package com.example.MediLine.DTO.FindDoctorDTO;

import com.example.MediLine.DTO.DoctorDegreeDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDetailsDTO {
    private int doctorId;
    private String name;
    private String specialization;
    private String designation;
    private String academicInstitution;
    private List<DoctorDegreeDTO> degrees;
    private List<AvailableMedCenters> availableMedCenters;
    private double rating;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AvailableMedCenters {
        private String HospitalName;
        private String HospitalLocation;
        private List<AvailabilitySlot> availabilitySlots;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AvailabilitySlot {
        private String weekDay;

        @JsonFormat(pattern = "hh:mm a")
        private LocalTime startTime;

        @JsonFormat(pattern = "hh:mm a")
        private LocalTime endTime;
    }



}
