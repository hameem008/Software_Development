package com.example.MediLine.DTO.DoctorSlotDTO;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteSlotRequest {
    @Positive(message = "Slot ID must be a positive number")
    private Integer slotId;
}