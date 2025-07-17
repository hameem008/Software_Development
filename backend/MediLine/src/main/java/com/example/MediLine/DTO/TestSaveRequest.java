package com.example.MediLine.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestSaveRequest {
    private int hospitalId;
    private int patientId;
    private int prescriptionId;
    private int testId;
    private LocalDate date;
    private String note;
    private int suggested;
    private int reviewed;
    private int cost;
}
