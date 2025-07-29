package com.example.MediLine.DTO.TestUploadDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestParamsDTO {
    private Integer testId;
    private String testName;
    private Integer suggestedByDoctorId;
    private String suggestedByDoctorName;

    private List<TestParamEntry> parameters;

    @Data
    @Builder
    public static class TestParamEntry {
        private String name;
        private String unit;
        private String normalMaleRange;
        private String normalFemaleRange;
        private String normalChildRange;
    }
}
