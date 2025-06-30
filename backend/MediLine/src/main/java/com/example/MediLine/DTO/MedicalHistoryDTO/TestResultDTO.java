package com.example.MediLine.DTO.MedicalHistoryDTO;


import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.MedicalCenterBaseDTO;
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
public class TestResultDTO {
    private Integer performedTestId;

    private String name;

    private DoctorBaseDTO orderedBy;

    private LocalDate date;

    private List<ResultEntry> results;

    private String notes;

    private DoctorBaseDTO performedBy;

    private DoctorBaseDTO reviewedBy;

    private MedicalCenterBaseDTO medicalCenter;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResultEntry {
        private String name;
        private String value;
        private String unit;
        private String idealFemaleRange;
        private String idealMaleRange;
        private String idealChildRange;
    }
}