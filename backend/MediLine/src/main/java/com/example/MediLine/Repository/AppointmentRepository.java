package com.example.MediLine.Repository;


import com.example.MediLine.DTO.AppointmentDTO.AppointmentDTO;
import com.example.MediLine.Entity.Appointment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findBySlotSlotIdAndDate(
            @Param("slotId") Integer slotIds,
            @Param("date") LocalDate date
    );


    @EntityGraph(attributePaths = {"slot", "slot.doctor","slot.hospital"})
    List<Appointment> findByPatientPatientId(
            @Param("patientId") Integer patientId);


    @Query("SELECT MAX(a.serialNumber) FROM Appointment a WHERE a.slot.slotId = :slotId")
    int findMaxSerialNumberBySlotId(
            @Param("slotId") Integer slotId);


    int countBySlotSlotIdAndTimeBetween(
            @Param("slotId") Integer slotId,
            @Param("start") LocalTime start,
            @Param("end") LocalTime end);

    boolean existsBySlotSlotIdAndDateAndTime(
            @Param("slotId") Integer slotId,
            @Param("date") LocalDate date,
            @Param("time") LocalTime time);



     @Query("""
        FROM Appointment a
        JOIN a.patient p
        JOIN a.slot da
        JOIN da.doctor d
        JOIN da.hospital h
        WHERE d.doctorId = :doctorId AND a.date >= CURRENT_DATE
        ORDER BY a.date, a.time
    """)
    List<Appointment> findUpcomingAppointments(@Param("doctorId") Integer doctorId);

    @Query("""
        FROM Appointment a
        JOIN a.patient p
        JOIN a.slot da
        JOIN da.doctor d
        JOIN da.hospital h
        WHERE d.doctorId = :doctorId AND a.date < CURRENT_DATE
        ORDER BY a.date DESC, a.time DESC
    """)
    List<Appointment> findPastAppointments(@Param("doctorId") Integer doctorId);

    @Query("""
        SELECT new com.example.MediLine.DTO.AppointmentDTO.AppointmentDTO(
            a.appointmentId,
            d.doctorId,
            CONCAT(d.firstName, ' ', d.lastName),
            h.hospitalId,
            h.name,
            a.date,
            a.time,
            da.chamber,
            a.serialNumber
        )
        FROM Appointment a
        JOIN a.slot da
        JOIN da.doctor d
        JOIN da.hospital h
        WHERE a.patient.patientId = :patientId
          AND a.date >= CURRENT_DATE
        ORDER BY a.date, a.time
    """)
    List<AppointmentDTO> getUpcomingAppointmentsByPatientId(@Param("patientId") Integer patientId);
}
