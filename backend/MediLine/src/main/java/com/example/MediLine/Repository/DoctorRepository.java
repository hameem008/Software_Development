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


    @Query(value = """
        SELECT d.doctor_id
        FROM doctor d
        WHERE
            similarity(LOWER(d.first_name), LOWER(:firstName)) > 0.3
            OR similarity(LOWER(d.last_name), LOWER(:lastName)) > 0.3
        ORDER BY
            GREATEST(
                similarity(LOWER(d.first_name), LOWER(:firstName)),
                similarity(LOWER(d.last_name), LOWER(:lastName))
            ) DESC
    """, nativeQuery = true)
    List<Integer> searchDoctorIdsByNameFuzzy(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName
    );



    @Query(value = """
        SELECT d.doctor_id
        FROM doctor d
        WHERE LOWER(CONCAT(d.first_name, ' ', d.last_name)) ILIKE CONCAT('%', LOWER(:name), '%')
    """, nativeQuery = true)
    List<Integer> searchDoctorIdsByName(@Param("name") String name);


    @EntityGraph(attributePaths = {"degrees", "availabilities"})
    List<Doctor> findByDoctorIdIn(List<Integer> doctorIds);


    @Query("SELECT DISTINCT d.specialization FROM Doctor d WHERE d.specialization IS NOT NULL")
    List<String> findAllDistinctSpecialties();


    @EntityGraph(attributePaths = "degrees")
    @Query("SELECT d FROM Doctor d WHERE d.doctorId = :id")
    Optional<Doctor> findWithDegreesById(@Param("id") Integer id);


    @EntityGraph(attributePaths = {"availabilities", "availabilities.hospital"})
    @Query("SELECT d FROM Doctor d WHERE d.doctorId = :id")
    Optional<Doctor> findWithAvailabilitiesById(@Param("id") Integer id);
}
