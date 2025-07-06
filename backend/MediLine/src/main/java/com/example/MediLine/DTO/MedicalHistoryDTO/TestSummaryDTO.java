package com.example.MediLine.DTO.MedicalHistoryDTO;

import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.HospitalBaseDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestSummaryDTO {
    private Integer performedTestId;

    private String name;

    private DoctorBaseDTO orderedBy;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    private DoctorBaseDTO performedBy;

    private DoctorBaseDTO reviewedBy;

    private HospitalBaseDTO hospital;
}
