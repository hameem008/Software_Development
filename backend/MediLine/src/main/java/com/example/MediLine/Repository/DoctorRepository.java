package com.example.MediLine.Repository;

import com.example.MediLine.DTO.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByEmail(String email);
    Optional<Doctor> findByPhoneNumber(String phoneNumber);
}
