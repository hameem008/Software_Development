package com.example.MediLine.DTO.TestUploadDTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTestRequest {
    @NotNull
    private Integer testId;

    @NotNull
    private Integer patientId;

    private Integer prescriptionId;
}
