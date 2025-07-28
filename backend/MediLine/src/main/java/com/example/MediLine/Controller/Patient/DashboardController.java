package com.example.MediLine.Controller.Patient;

import com.example.MediLine.Annotation.CurrentPatient;
import com.example.MediLine.DTO.PrescribedMedicineDTO;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Repository.PrescribedMedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/patient")
public class DashboardController {

    private final PrescribedMedicineRepository prescribedMedicineRepository;

    @GetMapping("/current-medicine")
    public ResponseEntity getCurrentMedicines(@CurrentPatient Patient patient) {
        if (patient == null) {
            return ResponseEntity.badRequest().body(null);
        }
        List<PrescribedMedicineDTO> currentMedicines = prescribedMedicineRepository.findActiveMedicinesByPatientId(patient.getPatientId());
        return ResponseEntity.ok(currentMedicines);
    }
}