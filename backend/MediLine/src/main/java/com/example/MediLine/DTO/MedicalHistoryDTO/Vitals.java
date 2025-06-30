package com.example.MediLine.DTO.MedicalHistoryDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Vitals {
    @Valid
    @NotNull
    private Measurement bloodPressure;

    @Valid
    @NotNull
    private Measurement weight;

    @Valid
    @NotNull
    private Measurement glucose;

    @Valid
    @NotNull
    private Measurement temperature;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Measurement {
        @NotBlank
        private String name;

        @NotBlank
        private String value;

        @NotBlank
        private String unit;
    }
}
