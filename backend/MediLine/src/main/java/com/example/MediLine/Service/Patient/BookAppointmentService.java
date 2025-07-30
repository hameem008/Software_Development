package com.example.MediLine.Service.Patient;

import com.example.MediLine.DTO.AppointmentDTO.AppointmentDTO;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentDoctorDTO;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentDoctorDTO.ConsultationLocation;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentWindowDTO;
import com.example.MediLine.DTO.AppointmentDTO.CreateAppointmentRequest;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.AppointmentRepository;
import com.example.MediLine.Repository.DoctorAvailabilityRepository;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class BookAppointmentService {
    private final PatientRepository patientRepository;

    private final DoctorRepository doctorRepository;

    private final DoctorAvailabilityRepository doctorAvailabilityRepository;

    private final AppointmentRepository appointmentRepository;


    public AppointmentDoctorDTO getBookAppointmentDoctor(int doctorId) {
        Doctor doctor = doctorRepository.findWithAvailabilitiesById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));


        return AppointmentDoctorDTO.builder()
                .doctorId(doctor.getDoctorId())
                .name(doctor.getFirstName() + " " + doctor.getLastName())
                .specialization(doctor.getSpecialization())
                .designation(doctor.getDesignation())
                .academicInstitution(doctor.getAcademicInstitution())
                .availableWeekdays(
                        doctor.getAvailabilities().stream()
                            .map(DoctorAvailability::getWeekDay)
                            .distinct()
                        .toList())
                .consultationLocations(
                        createConsultationLocations(doctor.getAvailabilities())
                )
                .build();
    }

    private List<ConsultationLocation> createConsultationLocations(
            Set<DoctorAvailability> availabilities) {

            return availabilities.stream()
                .collect(Collectors.groupingBy(
                    availability -> availability.getHospital().getHospitalId(),
                    Collectors.collectingAndThen(
                        Collectors.toList(),
                        groupedAvailabilities -> {
                            DoctorAvailability first = groupedAvailabilities.getFirst();
                            return new ConsultationLocation(
                                first.getHospital().getHospitalId(),
                                first.getHospital().getName(),
                                first.getHospital().getAddress(),
                                groupedAvailabilities.stream()
                                    .map(DoctorAvailability::getWeekDay)
                                    .distinct()
                                    .toList(),
                                (double) first.getVisitFee()
                            );
                        }
                    )
                ))
                .values()
                .stream()
                .toList();
    }


    public List<AppointmentWindowDTO> getAppointmentWindows(
            int doctorId, int hospitalId, LocalDate date) {

        String weekDay = date.getDayOfWeek().toString();

        DoctorAvailability availability = doctorAvailabilityRepository
                .findByDoctorMedCenterAndWeekDay(doctorId, hospitalId, weekDay)
                .orElseThrow(() ->
                        new IllegalArgumentException("Doctor availability not found for the given criteria"));

        List<Appointment> appointments =
                appointmentRepository.findBySlotSlotIdAndDate(availability.getSlotId(), date);

        return getAppointmentWindowsFromSlot(availability, appointments);

    }

    public void bookAppointment(CreateAppointmentRequest request) {

        DoctorAvailability slot = doctorAvailabilityRepository.findById(request.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));

        validateWeekDay(request.getDate(), slot.getWeekDay());
        validateTime(request.getTime(), slot.getStartTime(), slot.getEndTime());
        validateWindowAvailability(slot.getSlotId(), request.getDate(), request.getTime());

        Patient patient = patientRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setSlot(slot);
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setSerialNumber(getSerialNumber(slot, request.getTime()));
        appointment.setStatus(Appointment.AppointmentStatus.UPCOMING);

        appointmentRepository.save(appointment);
    }

    private void validateWeekDay(LocalDate requestDate, String slotWeekDay) {
        String requestedWeekDay = requestDate.getDayOfWeek().toString();
        String availabilityDay = slotWeekDay.toUpperCase();

        if (!availabilityDay.equalsIgnoreCase(requestedWeekDay)) {
            throw new IllegalArgumentException("This doctor is not available on the selected date");
        }
    }

    private void validateTime(LocalTime requestTime, LocalTime slotStart, LocalTime slotEnd) {
        if (requestTime.isBefore(slotStart) || !requestTime.isBefore(slotEnd)) {
            throw new IllegalStateException("Requested time is outside available slot time");
        }
    }


    private int getSerialNumber(DoctorAvailability slot, LocalTime appointmentTime) {
        long minutesFromStart =
                Duration.between(slot.getStartTime(), appointmentTime).toMinutes();

        return (int) (minutesFromStart / slot.getDuration()) + 1;
    }

    private void validateWindowAvailability(
            Integer slotId, LocalDate requestDate, LocalTime requestTime) {

        boolean isBooked = appointmentRepository
                .existsBySlotSlotIdAndDateAndTime(slotId, requestDate, requestTime);

        if (isBooked) {
            throw new IllegalStateException("This time slot is already booked");
        }
    }


    public List<AppointmentDTO> getPatientAppointments(int patientId) {
    List<Appointment> appointments =
            appointmentRepository.findByPatientPatientId(patientId);

    return appointments.stream().map(app -> {
        Doctor doctor = app.getSlot().getDoctor();
        Hospital center = app.getSlot().getHospital();

        return AppointmentDTO.builder()
                .appointmentId(app.getAppointmentId())
                .doctorId(doctor.getDoctorId())
                .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                .hospitalId(center.getHospitalId())
                .hospitalName(center.getName())
                .date(app.getDate())
                .time(app.getTime())
                .chamber(app.getSlot().getChamber())
                .serialNumber(app.getSerialNumber())
                .build();
    }).collect(Collectors.toList());
}


    private List<AppointmentWindowDTO> getAppointmentWindowsFromSlot(
        DoctorAvailability availability,
        List<Appointment> slotAppointments) {

        List<AppointmentWindowDTO> windows = new ArrayList<>();

        Integer slotId = availability.getSlotId();
        LocalTime start = availability.getStartTime();
        LocalTime end = availability.getEndTime();
        int duration = availability.getDuration();

        Set<LocalTime> bookedTimes = slotAppointments.stream()
                .map(Appointment::getTime)
                .collect(Collectors.toSet());

        LocalTime current = start;
        while (!current.isAfter(end.minusMinutes(duration))) {
            boolean isBooked = bookedTimes.contains(current);
            windows.add(new AppointmentWindowDTO(slotId, current, isBooked));
            current = current.plusMinutes(duration);
        }

        return windows;
    }

}
