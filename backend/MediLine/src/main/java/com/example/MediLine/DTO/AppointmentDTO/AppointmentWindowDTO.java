package com.example.MediLine.DTO.AppointmentDTO;

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
public class AppointmentWindowDTO {
    private Integer slotId;

    @JsonFormat(pattern = "hh:mm a")
    private LocalTime time;

    private boolean isBooked;
}



