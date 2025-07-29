package com.example.MediLine.Repository;

import com.example.MediLine.Entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
    Optional<Medicine> findByMedicineId(Integer medicineId);

    List<Medicine> findAll();
}
