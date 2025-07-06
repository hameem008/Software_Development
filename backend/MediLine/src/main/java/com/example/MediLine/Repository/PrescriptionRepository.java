package com.example.MediLine.Repository;

import com.example.MediLine.Entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {

    @Query("""
        SELECT p FROM Prescription p
        JOIN FETCH p.doctor d
        JOIN FETCH p.hospital h
        WHERE p.prescriptionId = :prescriptionId AND p.patient.patientId = :patientId
    """)
    Optional<Prescription> findByPrescriptionIdAndPatientId(
            @Param("prescriptionId") Integer prescriptionId,
            @Param("patientId") Integer patientId
    );

}
