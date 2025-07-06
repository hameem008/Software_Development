package com.example.MediLine.Repository;

import com.example.MediLine.Entity.PrescribedTest;
import com.example.MediLine.Entity.PrescribedTest.PrescribedTestId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescribedTestRepository extends JpaRepository<PrescribedTest, PrescribedTestId> {

    @Query("""
        SELECT t.testName
        FROM PrescribedTest pt
        JOIN pt.test t
        JOIN pt.prescription p
        WHERE p.prescriptionId = :prescriptionId AND p.patient.patientId = :patientId
    """)
    List<String> findTestsByPrescriptionId(
            @Param("prescriptionId") Integer prescriptionId,
            @Param("patientId") Integer patientId);
}
