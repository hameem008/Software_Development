package com.example.MediLine.Service.Doctor;

import com.example.MediLine.DTO.AppointmentDTO.DoctorAppointmentDTO;
import com.example.MediLine.Entity.Appointment;
import com.example.MediLine.Repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorAppointmentService {
    private final AppointmentRepository appointmentRepository;

    public List<DoctorAppointmentDTO> getUpcomingAppointments(Integer doctorId) {
        return appointmentRepository.findUpcomingAppointments(doctorId)
                .stream()
                .map(this::createAppointmentDTO)
                .toList();
    }

    public List<DoctorAppointmentDTO> getPastAppointments(Integer doctorId) {
        return appointmentRepository.findPastAppointments(doctorId)
                .stream()
                .map(this::createAppointmentDTO)
                .toList();
    }

    private DoctorAppointmentDTO createAppointmentDTO(Appointment appointment) {
        return DoctorAppointmentDTO.builder()
                .appointmentId(appointment.getAppointmentId())
                .patientId(appointment.getPatient().getPatientId())
                .patientName(appointment.getPatient().getFirstName() + " " +
                        appointment.getPatient().getLastName())
                .hospitalId(appointment.getSlot().getHospital().getHospitalId())
                .hospitalName(appointment.getSlot().getHospital().getName())
                .hospitalAddress(appointment.getSlot().getHospital().getAddress())
                .date(appointment.getDate())
                .time(appointment.getTime())
                .chamber(appointment.getSlot().getChamber())
                .serialNumber(appointment.getSerialNumber())
                .build();
    }
}


