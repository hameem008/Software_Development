package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "diagnosed_diseases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosedDisease {

    @EmbeddedId
    private DiagnosedDiseaseId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("prescriptionId")
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("diseaseId")
    @JoinColumn(name = "disease_id")
    private Disease disease;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiagnosedDiseaseId implements Serializable {
        @Column(name = "prescription_id")
        private Integer prescriptionId;

        @Column(name = "disease_id")
        private Integer diseaseId;
    }
}
