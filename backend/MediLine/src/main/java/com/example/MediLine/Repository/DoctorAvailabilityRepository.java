package com.example.MediLine.Repository;

import com.example.MediLine.Entity.DoctorAvailability;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Integer> {

    @Query("SELECT DISTINCT mc.address FROM DoctorAvailability da " +
            "JOIN da.hospital mc")
    List<String> findAllDistinctDoctorLocations();


    @EntityGraph(attributePaths = {"hospital"})
    List<DoctorAvailability> findByDoctorDoctorId(
            @Param("doctorId") Integer doctorId);


    @EntityGraph(attributePaths = {"doctor", "hospital"})
    @Query("""
        SELECT da FROM DoctorAvailability da
        WHERE da.doctor.doctorId = :doctorId
          AND da.hospital.hospitalId = :hospitalId
          AND LOWER(da.weekDay) = LOWER(:weekDay)
    """)
    Optional<DoctorAvailability> findByDoctorMedCenterAndWeekDay(
            @Param("doctorId") Integer doctorId,
            @Param("hospitalId") Integer hospitalId,
            @Param("weekDay") String weekDay);
}
