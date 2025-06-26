package com.example.MediLine.Repository;


import com.example.MediLine.Entity.DoctorReview;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DoctorReviewRepository extends JpaRepository<DoctorReview, Integer> {

    @Query("SELECT AVG(dr.rating) FROM DoctorReview dr WHERE dr.doctor.doctorId = :doctorId")
    double findAverageRatingByDoctorId(@Param("doctorId") Integer doctorId);


    @EntityGraph(attributePaths = {"patient"})
    List<DoctorReview> findByDoctorDoctorId(@Param("doctorId") Integer doctorId);
}

