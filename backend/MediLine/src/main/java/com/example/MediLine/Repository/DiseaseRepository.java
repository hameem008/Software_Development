package com.example.MediLine.Repository;

import com.example.MediLine.Entity.DiagnosedDisease;
import com.example.MediLine.Entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Integer> {
    Optional<Disease> findByDiseaseId(int id);

}
