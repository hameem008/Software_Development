package com.example.MediLine.Repository;

import com.example.MediLine.Entity.TestRequest;
import com.example.MediLine.Entity.TestRequest.TestRequestStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TestRequestRepository extends JpaRepository<TestRequest, Integer> {
    Optional<TestRequest> findByTestRequestId(Integer testRequestId);


    Optional<TestRequest> findByTestRequestIdAndStatus(Integer testRequestId, TestRequestStatus status);


    @Query("""
        SELECT COUNT(tr) > 0
        FROM TestRequest tr
        WHERE tr.testRequestId = :testRequestId
            AND tr.hospital.hospitalId = :hospitalId
    """)
    boolean hospitalIsAuthorized(
            @Param("hospitalId") Integer hospitalId,
            @Param("testRequestId") Integer testRequestId
    );

    @EntityGraph(attributePaths = {"prescription", "prescription.doctor"})
    @Query("""
        SELECT tr
        FROM TestRequest tr
        WHERE tr.testRequestId = :testRequestId
    """)
    Optional<TestRequest> findByIdWithPrescription(Integer testRequestId);

}