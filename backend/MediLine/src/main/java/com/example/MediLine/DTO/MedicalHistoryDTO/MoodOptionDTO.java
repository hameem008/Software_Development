package com.example.MediLine.DTO.MedicalHistoryDTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MoodOptionDTO {
    private int displayOrder;
    private String moodValue;
}
