package com.example.MediLine.Repository;

import com.example.MediLine.DTO.MedicalCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MedicalCenterRepository extends JpaRepository<MedicalCenter, Integer> {
    Optional<MedicalCenter> findByEmail(String email);
    Optional<MedicalCenter> findByPhoneNumber(String phoneNumber);
}