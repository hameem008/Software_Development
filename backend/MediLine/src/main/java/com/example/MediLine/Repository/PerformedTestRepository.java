package com.example.MediLine.Repository;

import com.example.MediLine.DTO.IdNameDTO;
import com.example.MediLine.Entity.Disease;
import com.example.MediLine.Entity.PerformedTest;
import com.example.MediLine.Entity.Test;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformedTestRepository extends JpaRepository<PerformedTest, Integer>, JpaSpecificationExecutor<PerformedTest> {
    @EntityGraph(attributePaths = {
        "prescription",
        "prescription.doctor",
        "performedByDoctor",
        "reviewedByDoctor",
        "hospital"
    })
    @Query("""
        SELECT pt FROM PerformedTest pt
        JOIN pt.prescription p
        WHERE p.patient.patientId = :patientId
        ORDER BY pt.testDate DESC
    """)
    List<PerformedTest> findByPatientIdWithDetails(@Param("patientId") Integer patientId);


    @EntityGraph(attributePaths = {
    "test",
    "hospital",
    "performedByDoctor",
    "reviewedByDoctor",
    "prescription"
    })
    @NonNull
    List<PerformedTest> findAll(Specification<PerformedTest> spec);


     @EntityGraph(attributePaths = {
        "prescription",
        "prescription.doctor",
        "performedByDoctor",
        "reviewedByDoctor",
        "hospital"
    })
    Optional<PerformedTest> findByPerformedTestId(Integer performedTestId);


     @Query("""
        SELECT COUNT(pt) > 0
        FROM PerformedTest pt
        WHERE pt.performedTestId = :id AND
        pt.prescription.patient.patientId = :patientId
    """)
    boolean patientIsAuthorized(
            @Param("id") Integer id,
            @Param("patientId") Integer patientId);


    @Query("""
        SELECT COUNT(pt) > 0
        FROM PerformedTest pt
        WHERE pt.performedTestId = :performedTestId
        AND pt.prescription.patient.patientId IN (
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
            @Param("doctorId") Integer doctorId,
            @Param("performedTestId") Integer performedTestId);


    @Query("""
        SELECT DISTINCT pt.test
        FROM PerformedTest pt
        JOIN pt.test t
        JOIN pt.prescription p
        WHERE p.patient.patientId = :patientId
    """)
    List<Test> findTestsByPatientId(@Param("patientId") Integer patientId);


}
