package com.example.MediLine.Repository;

import com.example.MediLine.Entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer> {
    Optional<Hospital> findByEmail(@Param("email") String email);

    Optional<Hospital> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}