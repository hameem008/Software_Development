package com.example.MediLine.Service.Patient;

import com.example.MediLine.DTO.AppointmentDTO.AppointmentDTO;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentDoctorDTO;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentWindowDTO;
import com.example.MediLine.DTO.AppointmentDTO.CreateAppointmentRequest;
import com.example.MediLine.Entity.Appointment;
import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Entity.DoctorAvailability;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Repository.AppointmentRepository;
import com.example.MediLine.Repository.DoctorAvailabilityRepository;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;


@Service
@RequiredArgsConstructor
public class BookAppointmentService {
    private final PatientRepository patientRepository;

    private final DoctorRepository doctorRepository;

    private final DoctorAvailabilityRepository doctorAvailabilityRepository;

    private final AppointmentRepository appointmentRepository;


    public AppointmentDoctorDTO getBookAppointmentDoctor(int doctorId) {
        Doctor doctor = doctorRepository.findWithAvailabilitiesById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));


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
                        doctor.getAvailabilities().stream()
                            .map(availability ->
                                    new AppointmentDoctorDTO.ConsultationLocation(
                                        availability.getMedicalCenter().getMedicalCenterId(),
                                        availability.getMedicalCenter().getName(),
                                        availability.getMedicalCenter().getAddress(),
                                        (double) availability.getVisitFee()))
                            .distinct()
                            .toList())
                .build();
    }


    public List<AppointmentWindowDTO> getAppointmentWindows(
            int doctorId, int medicalCenterId, String weekDay) {

        DoctorAvailability availability = doctorAvailabilityRepository
                .findByDoctorMedCenterAndWeekDay(doctorId, medicalCenterId, weekDay)
                .orElseThrow(() ->
                        new IllegalArgumentException("Doctor availability not found for the given criteria"));

        List<Appointment> appointments =
                appointmentRepository.findBySlotSlotId(availability.getSlotId());

        return getAppointmentWindowsFromSlot(availability, appointments);

    }

    public void bookAppointment(CreateAppointmentRequest request) {

        DoctorAvailability slot = doctorAvailabilityRepository.findById(request.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));

        validateWeekDay(request.getDate(), slot.getWeekDay());
        validateTime(request.getTime(), slot.getStartTime(), slot.getEndTime());
        validateWindowAvailability(slot, request.getTime());

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Patient patient = patientRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));


        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setSlot(slot);
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setSerialNumber(getSerialNumber(request.getSlotId()));

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

    private int getSerialNumber(Integer slotId) {
        Integer maxSerial = appointmentRepository.findMaxSerialNumberBySlotId(slotId);
        return (maxSerial == null) ? 1 : maxSerial + 1;
    }

    private void validateWindowAvailability(
            DoctorAvailability slot, LocalTime requestTime) {

        final int WINDOW_DURATION = 30;
        LocalTime chunkEnd = requestTime.plusMinutes(WINDOW_DURATION);

        int existingCount = appointmentRepository.
                countBySlotSlotIdAndTimeBetween(slot.getSlotId(), requestTime, chunkEnd);

        if (existingCount >= WINDOW_DURATION / slot.getDuration()) {
            throw new IllegalStateException("This time slot is fully booked");
        }
    }

    public List<AppointmentDTO> getPatientAppointments(int patientId) {
        List<Appointment> appointments =
                appointmentRepository.findByPatientPatientId(patientId);

        return appointments.stream().map(app ->
                AppointmentDTO.builder()
                    .appointmentId(app.getAppointmentId())
                    .doctorId(app.getDoctor().getDoctorId())
                    .doctorName(app.getDoctor().getFirstName() + " " + app.getDoctor().getLastName())
                    .medicalCenterId(app.getSlot().getMedicalCenter().getMedicalCenterId())
                    .medicalCenterName(app.getSlot().getMedicalCenter().getName())
                    .date(app.getDate())
                    .time(app.getTime())
                    .chamber(app.getSlot().getChamber())
                    .serialNumber(app.getSerialNumber())
                    .build()
        ).collect(toList());
    }


    private List<AppointmentWindowDTO> getAppointmentWindowsFromSlot(
            DoctorAvailability availability,
            List<Appointment> slotAppointments) {

        List<AppointmentWindowDTO> appointmentWindows = new ArrayList<>();

        Integer slotId = availability.getSlotId();
        LocalTime start = availability.getStartTime();
        LocalTime end = availability.getEndTime();
        int timeForEachPatient = availability.getDuration();
        final int WINDOW_SIZE = 30;

        LocalTime current = start;
        while (!current.isAfter(end)) {
            LocalTime windowStart = current;
            LocalTime windowEnd = current.plusMinutes(WINDOW_SIZE);

            long count = slotAppointments.stream()
                    .filter(app -> {
                        LocalTime time = app.getTime();
                        return !time.isBefore(windowStart) && time.isBefore(windowEnd);
                    })
                    .count();

            boolean isBooked = count >= (WINDOW_SIZE / timeForEachPatient);

            appointmentWindows.add(new AppointmentWindowDTO(slotId, windowStart, isBooked));
            current = windowEnd;
        }

        return appointmentWindows;
    }
}
