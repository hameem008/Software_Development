package com.example.MediLine.DTO.DoctorSlotDTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddSlotRequest {
    @NotBlank(message = "Week day cannot be blank")
    private String weekDay;

    @NotNull(message = "Start time cannot be null")
    @JsonFormat(pattern = "hh:mm a")
    private LocalTime startTime;

    @NotNull(message = "End time cannot be null")
    @JsonFormat(pattern = "hh:mm a")
    private LocalTime endTime;

    @NotBlank(message = "Medical center name cannot be blank")
    private String medicalCenterName;

    @NotBlank(message = "Medical center location cannot be blank")
    private String medicalCenterLocation;

    @Positive(message = "Consultation fee must be a positive number")
    private Integer consultationFee;

    @Positive(message = "Duration must be a positive number")
    private Integer duration;
}
