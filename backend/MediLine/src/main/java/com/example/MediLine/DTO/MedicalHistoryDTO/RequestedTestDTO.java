package com.example.MediLine.DTO.MedicalHistoryDTO;

import com.example.MediLine.DTO.HospitalBaseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestedTestDTO {
    private Integer requestId;

    private String testName;

    private String status;

    private LocalDateTime requestedDate;

    private HospitalBaseDTO hospital;

}
