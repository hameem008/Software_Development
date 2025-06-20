package com.example.MediLine.Repository;

import com.example.MediLine.DTO.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer> {
    Optional<Hospital> findByEmail(String email);
    Optional<Hospital> findByPhoneNumber(String phoneNumber);
}