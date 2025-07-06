package com.example.MediLine.DTO.DoctorSlotDTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorSlotDTO {
    private Integer slotId;

    private String weekDay;

    @JsonFormat(pattern = "hh:mm a")
    private LocalTime startTime;

    @JsonFormat(pattern = "hh:mm a")
    private LocalTime endTime;

    private String hospitalName;

    private String hospitalLocation;

    private Integer consultationFee;

    private Integer duration;
}
