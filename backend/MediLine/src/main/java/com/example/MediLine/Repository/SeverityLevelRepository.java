package com.example.MediLine.Repository;

import com.example.MediLine.Entity.SeverityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeverityLevelRepository extends JpaRepository<SeverityLevel, Integer> {
    List<SeverityLevel> findAllByOrderBySeverityLevelAsc();
}
