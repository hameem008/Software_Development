package com.example.MediLine.Controller.Patient;

import com.example.MediLine.Annotation.CurrentPatient;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentDTO;
import com.example.MediLine.DTO.CurrentMedicineDTO;
import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.SymptomDTO;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Repository.AppointmentRepository;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Repository.PrescribedMedicineRepository;
import com.example.MediLine.Repository.SymptomRepository;
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

    private final SymptomRepository symptomRepository;
    private final DoctorRepository doctorRepository;

    public List<SymptomDTO> getLatestFiveSymptoms(Integer patientId) {
        List<SymptomDTO> ret = symptomRepository.findSymptomsByPatientId(patientId)
                .stream()
                .limit(5)
                .map(s -> new SymptomDTO(
                        s.getDescription(),
                        s.getSymptomId().getDate(),
                        s.getSymptomId().getTime(),
                        s.getOverallMood(),
                        s.getSeverityLevel()
                ))
                .toList();
        return ret;
    }

    public List<DoctorBaseDTO> getLatestFiveDoctorsBySpecialization(String specialization) {
        List<DoctorBaseDTO> ret = doctorRepository.findDoctorsBySpecialization(specialization)
                .stream()
                .limit(5)
                .map(doctor -> new DoctorBaseDTO(
                        doctor.getDoctorId(),
                        (doctor.getFirstName() != null ? doctor.getFirstName() : "") + " " +
                                (doctor.getLastName() != null ? doctor.getLastName() : ""),
                        doctor.getSpecialization() != null ? doctor.getSpecialization() : "",
                        doctor.getDesignation() != null ? doctor.getDesignation() : "",
                        doctor.getAcademicInstitution() != null ? doctor.getAcademicInstitution() : ""
                ))
                .toList();
        return ret;
    }

    @GetMapping("/ping")
    public String ping(@CurrentPatient Patient patient) {
        if (patient == null) {
            return "null";
        }
        System.out.println(getLatestFiveDoctorsBySpecialization("Cardiology"));
        return "Gotcha";
    }

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