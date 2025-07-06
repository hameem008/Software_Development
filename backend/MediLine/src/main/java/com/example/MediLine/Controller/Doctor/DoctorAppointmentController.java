package com.example.MediLine.Controller.Doctor;

import com.example.MediLine.Annotation.CurrentDoctor;
import com.example.MediLine.DTO.AppointmentDTO.DoctorAppointmentDTO;
import com.example.MediLine.DTO.DoctorSlotDTO.AddSlotRequest;
import com.example.MediLine.DTO.DoctorSlotDTO.DeleteSlotRequest;
import com.example.MediLine.DTO.DoctorSlotDTO.DoctorSlotDTO;
import com.example.MediLine.DTO.DoctorSlotDTO.EditSlotRequest;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Service.Doctor.DoctorAppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/appointment")
@RequiredArgsConstructor
public class DoctorAppointmentController {

    private final DoctorAppointmentService doctorAppointmentService;


    @GetMapping("/upcoming")
    public ResponseEntity<List<DoctorAppointmentDTO>> getUpcomingAppointments(
            @CurrentDoctor Doctor doctor) {

        List<DoctorAppointmentDTO> appointments = doctorAppointmentService
                .getUpcomingAppointments(doctor.getDoctorId());

        if(appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/past")
    public ResponseEntity<List<DoctorAppointmentDTO>> getPastAppointments(
            @CurrentDoctor Doctor doctor) {

        List<DoctorAppointmentDTO> appointments = doctorAppointmentService
                .getPastAppointments(doctor.getDoctorId());

        if(appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }


    @GetMapping("/slots")
    public ResponseEntity<List<DoctorSlotDTO>> getDoctorSlots() {

       return null;
    }

    @PostMapping("/slots/edit")
    public ResponseEntity<List<DoctorSlotDTO>> editSlot(
            @RequestBody @Valid
            EditSlotRequest editSlotRequest) {

       return null;
    }

    @PutMapping("/slots/add")
    public ResponseEntity<List<DoctorSlotDTO>> addSlot(
            @RequestBody @Valid
            AddSlotRequest addSlotRequest) {

       return null;
    }

    @PutMapping("/delete")
    public ResponseEntity<List<DoctorSlotDTO>> deleteSlot(
            @RequestBody @Valid
            DeleteSlotRequest deleteSlotRequest) {

       return null;
    }
}
