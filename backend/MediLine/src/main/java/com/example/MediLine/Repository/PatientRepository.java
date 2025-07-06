package com.example.MediLine.Repository;

import com.example.MediLine.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(@Param("email") String email);

    Optional<Patient> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    Optional<Patient> findByPatientId(@Param("patientId") Integer patientId);
}

