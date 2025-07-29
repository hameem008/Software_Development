package com.example.MediLine.Repository;

import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends
        JpaRepository<Prescription, Integer> ,
        JpaSpecificationExecutor<Prescription> {

    @Query("""
        SELECT p FROM Prescription p
        JOIN FETCH p.doctor d
        JOIN FETCH p.hospital h
        WHERE p.prescriptionId = :prescriptionId
    """)
    Optional<Prescription> findByPrescriptionId(
            @Param("prescriptionId") Integer prescriptionId
    );

    @Query("""
        SELECT DISTINCT d FROM Prescription p
        JOIN p.doctor d
        WHERE p.patient.patientId = :patientId
    """)
    List<Doctor> findPrescriptionDoctors(
            @Param("patientId") Integer patientId
    );

    @Query("""
        SELECT COUNT(p) > 0
        FROM Prescription p
        WHERE p.prescriptionId = :prescriptionId
            AND p.patient.patientId = :patientId
    """)
    boolean patientIsAuthorized(
            @Param("prescriptionId") Integer prescriptionId,
            @Param("patientId") Integer patientId
    );


    @Query("""
        SELECT COUNT(p) > 0
        FROM Prescription p
        WHERE p.patient.patientId = :patientId
            AND p.doctor.doctorId = :doctorId
    """)
    boolean existsByDoctorAndPatient(
            @Param("doctorId") Integer doctorId,
            @Param("patientId") Integer patientId);


     @Query("""
        SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
        FROM Prescription p
        WHERE p.prescriptionId = :prescriptionId
        AND p.patient.patientId IN (
            SELECT a.patient.patientId
                FROM Appointment a
                WHERE a.slot.doctor.doctorId = :doctorId
            UNION
            SELECT pr.patient.patientId
                FROM Prescription pr
                WHERE pr.doctor.doctorId = :doctorId
            )
    """)
    boolean doctorIsAuthorized(
            @Param("prescriptionId") Integer prescriptionId,
            @Param("doctorId") Integer doctorId);


}
