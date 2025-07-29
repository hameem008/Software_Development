package com.example.MediLine.Repository.Specification;


import com.example.MediLine.DTO.MedicalHistoryDTO.TestListRequest;
import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Entity.PerformedTest;
import com.example.MediLine.Entity.Prescription;
import com.example.MediLine.Entity.Test;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;


public class PerformedTestSpecification {

    public static Specification<PerformedTest> filterPerformedTests(TestListRequest request, Integer patientId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Join to Prescription -> Patient
            Join<PerformedTest, Prescription> prescriptionJoin = root.join("prescription");
            Join<Prescription, Patient> patientJoin = prescriptionJoin.join("patient");

            // Required: filter by patientId
            predicates.add(cb.equal(patientJoin.get("patientId"), patientId));

            // Optional: filter by dateFrom
            if (request.getDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("testDate"), request.getDateFrom()));
            }

            // Optional: filter by dateTo
            if (request.getDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("testDate"), request.getDateTo()));
            }

            // Optional: filter by testId
            if (request.getTestId() != null) {
                Join<PerformedTest, Test> testJoin = root.join("test");
                predicates.add(cb.equal(testJoin.get("Id"), request.getTestId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
