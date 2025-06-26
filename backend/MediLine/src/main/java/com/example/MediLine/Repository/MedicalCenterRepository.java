package com.example.MediLine.Repository;

import com.example.MediLine.Entity.MedicalCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MedicalCenterRepository extends JpaRepository<MedicalCenter, Integer> {
    Optional<MedicalCenter> findByEmail(@Param("email") String email);

    Optional<MedicalCenter> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}