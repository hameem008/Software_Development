package com.example.MediLine.Repository;

import com.example.MediLine.Entity.DiagnosedDisease;
import com.example.MediLine.Entity.DiagnosedDisease.DiagnosedDiseaseId;
import com.example.MediLine.Entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosedDiseaseRepository extends JpaRepository<DiagnosedDisease, DiagnosedDiseaseId> {

    @Query("""
        SELECT d.diseaseName
        FROM DiagnosedDisease dd
        JOIN dd.disease d
        JOIN dd.prescription p
        WHERE p.prescriptionId = :prescriptionId
    """)
    List<String> findDiseaseNamesByPrescriptionId(
            @Param("prescriptionId") Integer prescriptionId);

    @Query("""
        SELECT DISTINCT dd.disease
        FROM DiagnosedDisease dd
        JOIN dd.disease d
        JOIN dd.prescription p
        WHERE p.patient.patientId = :patientId
    """)
    List<Disease> findDiseasesByPatientId(@Param("patientId") Integer patientId);

}

