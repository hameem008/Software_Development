package com.example.MediLine.DTO.TestUploadDTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveTestResultRequest {
    @NotNull
    private int requestId;

    private String note;
    private int performedDoctorId;
    private int reviewedDoctorID;

    @NotNull
    private List<ResultEntry> resultEntries;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResultEntry {
        private String name;
        private String value;
    }
}
