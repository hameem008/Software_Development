package com.example.MediLine.Controller.Patient;

import com.example.MediLine.Annotation.CurrentPatient;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentDTO;
import com.example.MediLine.DTO.CurrentMedicineDTO;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Repository.AppointmentRepository;
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
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/current-medicine")
    public ResponseEntity getCurrentMedicines(@CurrentPatient Patient patient) {
        if (patient == null) {
            return ResponseEntity.badRequest().body(null);
        }
        List<CurrentMedicineDTO> currentMedicines = prescribedMedicineRepository.findActiveMedicinesByPatientId(patient.getPatientId());
        return ResponseEntity.ok(currentMedicines);
    }

    @GetMapping("/upcoming-appointments")
    public ResponseEntity<?> getUpcomingAppointments(@CurrentPatient Patient patient) {
        if (patient == null) {
            return ResponseEntity.badRequest().body("Patient not authenticated");
        }
        List<AppointmentDTO> upcomingAppointments = appointmentRepository.getUpcomingAppointmentsByPatientId(patient.getPatientId());
        return ResponseEntity.ok(upcomingAppointments);
    }
}