package com.example.MediLine.Service.Patient;

import com.example.MediLine.DTO.AppointmentDTO.AppointmentDTO;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentDoctorDTO;
import com.example.MediLine.DTO.AppointmentDTO.AppointmentWindowDTO;
import com.example.MediLine.DTO.AppointmentDTO.CreateAppointmentRequest;
import com.example.MediLine.Entity.*;
import com.example.MediLine.Repository.*;
import com.example.MediLine.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BookAppointmentServiceTest {

    @Mock private PatientRepository patientRepository;
    @Mock private DoctorRepository doctorRepository;
    @Mock private DoctorAvailabilityRepository doctorAvailabilityRepository;
    @Mock private AppointmentRepository appointmentRepository;

    @InjectMocks private BookAppointmentService service;

    private Doctor doctor;
    private DoctorAvailability slot;
    private Appointment app;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        doctor = TestDataFactory.createDoctor();
        slot = TestDataFactory.createDoctorAvailability();
        app = TestDataFactory.createAppointment();
    }

    @Test
    void testGetBookAppointmentDoctor_success() {
        when(doctorRepository.findWithAvailabilitiesById(1))
                .thenReturn(Optional.of(doctor));

        AppointmentDoctorDTO dto = service.getBookAppointmentDoctor(1);
        assertEquals(1, dto.getDoctorId());
        assertEquals("John Doe", dto.getName());
        assertTrue(dto.getAvailableWeekdays().contains("WEDNESDAY"));
        assertEquals("Apollo Hospital", dto.getConsultationLocations().getFirst().getMedicalCenterName());
    }

    @Test
    void testGetBookAppointmentDoctor_doctorNotFound() {
        when(doctorRepository.findWithAvailabilitiesById(99)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class,
                () -> service.getBookAppointmentDoctor(99));
    }

    @Test
    void testGetAppointmentWindows_success() {
        LocalDate date = LocalDate.of(2025, 6, 25);

        when(doctorAvailabilityRepository.findByDoctorMedCenterAndWeekDay(
                anyInt(), anyInt(), eq("WEDNESDAY")))
                    .thenReturn(Optional.of(slot));
        when(appointmentRepository.findBySlotSlotIdAndDate(eq(1), eq(date)))
                .thenReturn(List.of(app));

        List<AppointmentWindowDTO> result = service.getAppointmentWindows(1, 1, date);
        assertEquals(16, result.size());
        assertTrue(
                result.stream().anyMatch(w ->
                    w.getTime().equals(LocalTime.of(10, 30)) && w.isBooked())
        );
        assertTrue(
                result.stream().anyMatch(w ->
                    w.getTime().equals(LocalTime.of(11, 30)) && !w.isBooked())
        );
    }

    @Test
    void testGetAppointmentWindows_availabilityNotFound() {
        when(doctorAvailabilityRepository.findByDoctorMedCenterAndWeekDay(anyInt(), anyInt(), anyString()))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> service.getAppointmentWindows(1, 1, LocalDate.now()));
    }

    @Test
    void testBookAppointment_success() {

        LocalDate date = LocalDate.of(2025, 8, 6);
        LocalTime time = LocalTime.of(11, 0);

        CreateAppointmentRequest appointmentRequest =
                new CreateAppointmentRequest(1, 1, date, time);

        Patient patient = TestDataFactory.createPatient();

        when(doctorAvailabilityRepository.findById(1))
                .thenReturn(Optional.of(slot));
        when(patientRepository.findByPatientId(1))
                .thenReturn(Optional.of(patient));
        when(appointmentRepository.existsBySlotSlotIdAndDateAndTime(1, date, time))
                .thenReturn(false);

        assertDoesNotThrow(() -> service.bookAppointment(appointmentRequest));
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void testBookAppointment_invalidWeekDay() {
        CreateAppointmentRequest request =
                new CreateAppointmentRequest(
                        1, 1,
                        LocalDate.of(2025, 7, 1), // Tuesday
                        LocalTime.of(10, 0)
                );

        when(doctorAvailabilityRepository.findById(1)).thenReturn(Optional.of(slot));

        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> service.bookAppointment(request));
        assertTrue(ex.getMessage().contains("not available"));
    }

    @Test
    void testBookAppointment_outsideTimeRange() {
        CreateAppointmentRequest request =
                new CreateAppointmentRequest(
                        1, 1,
                        LocalDate.of(2025, 6, 25),
                        LocalTime.of(9, 0)
                );

        when(doctorAvailabilityRepository.findById(1)).thenReturn(Optional.of(slot));

        Exception ex = assertThrows(IllegalStateException.class, () ->
                service.bookAppointment(request));
        assertTrue(ex.getMessage().contains("outside available slot time"));
    }

    @Test
    void testBookAppointment_alreadyBooked() {
        CreateAppointmentRequest request =
                new CreateAppointmentRequest(
                        1, 1,
                        LocalDate.of(2025, 6, 25),
                        LocalTime.of(10, 0)
                );

        when(doctorAvailabilityRepository.findById(1)).thenReturn(Optional.of(slot));
        when(appointmentRepository.existsBySlotSlotIdAndDateAndTime(
                1, request.getDate(), request.getTime()))
                .thenReturn(true);

        Exception ex = assertThrows(IllegalStateException.class, () ->
                service.bookAppointment(request));
        assertTrue(ex.getMessage().contains("already booked"));
    }

    @Test
    void testGetPatientAppointments() {
        Appointment app = TestDataFactory.createAppointment();

        when(appointmentRepository.findByPatientPatientId(1))
                .thenReturn(List.of(app));

        List<AppointmentDTO> appointments = service.getPatientAppointments(1);
        assertEquals(1, appointments.size());
        assertEquals("John Doe", appointments.getFirst().getDoctorName());
        assertEquals("Apollo Hospital", appointments.getFirst().getMedicalCenterName());
    }
}
