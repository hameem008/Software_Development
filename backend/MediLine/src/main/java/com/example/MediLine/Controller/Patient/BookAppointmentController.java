package com.example.MediLine.Controller.Patient;

import com.example.MediLine.Annotation.CurrentPatient;
import com.example.MediLine.DTO.AppointmentDTO.*;
import com.example.MediLine.DTO.FindDoctorDTO.DoctorRequest;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Service.Patient.BookAppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient/appointment")
@RequiredArgsConstructor
public class BookAppointmentController {

    private final BookAppointmentService appointmentService;


    @PostMapping("/doctor")
    public ResponseEntity<AppointmentDoctorDTO> getBookAppointmentDoctor(
            @RequestBody DoctorRequest doctorRequest) {

        return ResponseEntity.ok(
                appointmentService.getBookAppointmentDoctor(doctorRequest.getDoctorId())
        );
    }

    @PostMapping("/doctor/windows")
    public ResponseEntity<List<AppointmentWindowDTO>> getDoctorAppointmentWindows(
            @RequestBody
            @Valid
            AppointmentWindowRequest windowRequest) {

        List<AppointmentWindowDTO> windows = appointmentService.getAppointmentWindows(
                windowRequest.getDoctorId(),
                windowRequest.getHospitalId(),
                windowRequest.getDate()
        );

        if (windows.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(windows);
    }

    @PostMapping("/book")
    public ResponseEntity<String> bookAppointment(
            @RequestBody @Valid CreateAppointmentRequest request,
            @CurrentPatient Patient patient) {

        request.setPatientId(patient.getPatientId());

        appointmentService.bookAppointment(request/*, patient.getPatientId()*/);
        return ResponseEntity.ok("Appointment booked successfully");
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<AppointmentDTO>> getPatientAppointments(
            @CurrentPatient Patient patient) {

        List<AppointmentDTO> appointments =
                appointmentService.getPatientAppointments(patient.getPatientId());

        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }
}
