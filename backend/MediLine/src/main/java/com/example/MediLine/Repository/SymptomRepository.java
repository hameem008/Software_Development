package com.example.MediLine.Repository;

import com.example.MediLine.Entity.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SymptomRepository extends JpaRepository<Symptom, Symptom.SymptomId> {

    @Query("""
    SELECT s FROM Symptom s
    WHERE s.patient.patientId = :patientId
    ORDER BY s.symptomId.date DESC, s.symptomId.time DESC
    """)
    List<Symptom> findSymptomsByPatientId(
        @Param("patientId") Integer patientId
    );

}
