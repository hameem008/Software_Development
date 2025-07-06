package com.example.MediLine.DTO.MedicalHistoryDTO;

import com.example.MediLine.DTO.DoctorBaseDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionDTO {
    private String prescriptionId;
    private DoctorBaseDTO doctor;

    private LocalDate issuedDate;

    private String summary;
    private Vitals vitals;
    private String symptoms;
    private List<String> diagnosis;
    private List<String> tests;
    private List<Medication> medications;
    private String notes;
    private LocalDate nextAppointment;
}
