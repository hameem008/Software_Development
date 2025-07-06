package com.example.MediLine.Repository;

import com.example.MediLine.Entity.PerformedTest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformedTestRepository extends JpaRepository<PerformedTest, Integer> {
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


    @Query("""
        SELECT pt
        FROM PerformedTest pt
        JOIN pt.prescription p
        WHERE pt.performedTestId = :id AND
        p.patient.patientId = :patientId
    """)
    Optional<PerformedTest> findByIdAndPatientId(
            @Param("id") Integer id,
            @Param("patientId") Integer patientId);



}
