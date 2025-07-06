package com.example.MediLine.Repository;

import com.example.MediLine.Entity.Doctor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByEmail(@Param("email") String email);


    Optional<Doctor> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);


    @EntityGraph(attributePaths = {"degrees", "availabilities"})
    @Query("""
    SELECT d FROM Doctor d
    WHERE (:specialization IS NULL OR d.specialization = :specialization)
    AND (:location IS NULL OR EXISTS (
       SELECT da FROM d.availabilities da
       WHERE LOWER(da.hospital.address) LIKE LOWER(CONCAT('%', :location, '%'))
    ))
""")
    List<Doctor> searchDoctors(
            @Param("specialization") String specialization,
            @Param("location") String location);


    @Query("SELECT DISTINCT d.specialization FROM Doctor d WHERE d.specialization IS NOT NULL")
    List<String> findAllDistinctSpecialties();


    @EntityGraph(attributePaths = "degrees")
    @Query("SELECT d FROM Doctor d WHERE d.doctorId = :id")
    Optional<Doctor> findWithDegreesById(@Param("id") Integer id);


    @EntityGraph(attributePaths = {"availabilities", "availabilities.hospital"})
    @Query("SELECT d FROM Doctor d WHERE d.doctorId = :id")
    Optional<Doctor> findWithAvailabilitiesById(@Param("id") Integer id);
}
