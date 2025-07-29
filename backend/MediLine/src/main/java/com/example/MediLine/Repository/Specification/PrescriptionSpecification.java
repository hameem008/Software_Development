package com.example.MediLine.Repository.Specification;

import com.example.MediLine.DTO.MedicalHistoryDTO.PrescriptionListRequest;
import com.example.MediLine.Entity.DiagnosedDisease;
import com.example.MediLine.Entity.Prescription;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class PrescriptionSpecification {

    public static Specification<Prescription> filterByRequest(PrescriptionListRequest request, Integer patientId) {
        return (root, query, cb) -> {
            root.fetch("doctor");
            root.fetch("patient");

            Predicate predicate = cb.conjunction();

            // Always filter by patient
            predicate =
                    cb.and(predicate, cb.equal(root.get("patient").get("patientId"), patientId));

            if (request.getDoctorId() != null) {
                predicate = cb.and(
                        predicate,
                        cb.equal(
                            root.get("doctor").get("doctorId"),
                            request.getDoctorId()
                        )
                );
            }

            if (request.getDiseaseId() != null) {
                Join<Prescription, DiagnosedDisease> diseaseJoin =
                        root.join("diagnosedDiseases", JoinType.INNER);
                predicate = cb.and(
                        predicate,
                        cb.equal(
                                diseaseJoin.get("id").get("diseaseId"),
                                request.getDiseaseId()
                        )
                );
            }

            if (request.getDateFrom() != null) {
                predicate = cb.and(
                        predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("prescribedDate"),
                                request.getDateFrom()
                        )
                );
            }

            if (request.getDateTo() != null) {
                predicate = cb.and(
                        predicate,
                        cb.lessThanOrEqualTo(
                                root.get("prescribedDate"),
                                request.getDateTo()
                        )
                );
            }

            if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
                String keyword = "%" + request.getKeyword().toLowerCase() + "%";
                Predicate summaryMatch = cb.like(cb.lower(root.get("summary")), keyword);
                Predicate notesMatch = cb.like(cb.lower(root.get("notes")), keyword);
                Predicate symptomsMatch = cb.like(cb.lower(root.get("symptoms")), keyword);
                predicate = cb.and(predicate, cb.or(summaryMatch, notesMatch, symptomsMatch));
            }

            if (query != null) {
                query.orderBy(cb.desc(root.get("prescribedDate")));
            }

            return predicate;
        };
    }
}
