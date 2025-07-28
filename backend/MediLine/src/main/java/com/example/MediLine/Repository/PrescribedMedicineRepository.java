package com.example.MediLine.Repository;

import com.example.MediLine.Entity.PrescribedMedicine;
import com.example.MediLine.Entity.PrescribedMedicine.PrescribedMedicineId;
import com.example.MediLine.DTO.CurrentMedicineDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescribedMedicineRepository extends JpaRepository<PrescribedMedicine, PrescribedMedicineId> {

    @Query("""
        SELECT pm
        FROM PrescribedMedicine pm
        JOIN pm.prescription p
        JOIN pm.medicine m
        WHERE p.prescriptionId = :prescriptionId AND p.patient.patientId = :patientId
    """)
    List<PrescribedMedicine> findByPrescriptionId(
            @Param("prescriptionId") Integer prescriptionId,
            @Param("patientId") Integer patientId);

    @Query("""
        SELECT new com.example.MediLine.DTO.CurrentMedicineDTO(
            pm.id.prescriptionId,
            pm.id.medicineId,
            m.medicineName,
            pm.dosage,
            pm.frequency,
            pm.durationValue,
            pm.durationUnit,
            pm.instruction
        )
        FROM PrescribedMedicine pm
        JOIN pm.prescription p
        JOIN pm.medicine m
        WHERE p.patient.patientId = :patientId
        AND p.prescribedDate <= CURRENT_DATE
        AND CASE pm.durationUnit
            WHEN 'day' THEN p.prescribedDate + pm.durationValue DAY >= CURRENT_DATE
            WHEN 'week' THEN p.prescribedDate + (pm.durationValue * 7) DAY >= CURRENT_DATE
            WHEN 'month' THEN p.prescribedDate + (pm.durationValue * 30) DAY >= CURRENT_DATE
        END
    """)
    List<CurrentMedicineDTO> findActiveMedicinesByPatientId(@Param("patientId") Integer patientId);
}