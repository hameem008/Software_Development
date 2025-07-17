package com.example.MediLine.Repository;

import com.example.MediLine.Entity.PrescribedMedicine;
import com.example.MediLine.Entity.PrescribedMedicine.PrescribedMedicineId;
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
        WHERE p.prescriptionId = :prescriptionId
    """)
    List<PrescribedMedicine> findByPrescriptionId(
            @Param("prescriptionId") Integer prescriptionId);
}
