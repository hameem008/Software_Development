package com.example.MediLine.Repository;


import com.example.MediLine.Entity.Appointment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findBySlotSlotId(
            @Param("slotId") Integer slotIds);


    @EntityGraph(attributePaths = {"doctor", "patient", "slot", "slot.medicalCenter"})
    List<Appointment> findByPatientPatientId(
            @Param("patientId") Integer patientId);


    @Query("SELECT MAX(a.serialNumber) FROM Appointment a WHERE a.slot.slotId = :slotId")
    int findMaxSerialNumberBySlotId(
            @Param("slotId") Integer slotId);


    int countBySlotSlotIdAndTimeBetween(
            @Param("slotId") Integer slotId,
            @Param("start") LocalTime start,
            @Param("end") LocalTime end);

}
