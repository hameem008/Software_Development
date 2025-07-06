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
        WHERE pt.prescription.prescriptionId = :prescriptionId
    """)
    List<String> findTestsByPrescriptionId(@Param("prescriptionId") Integer prescriptionId);
}
