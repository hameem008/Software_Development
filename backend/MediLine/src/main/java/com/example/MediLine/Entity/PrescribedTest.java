package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "prescribed_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrescribedTest {

    @EmbeddedId
    private PrescribedTestId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("prescriptionId")
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("testId")
    @JoinColumn(name = "test_id")
    private Test test;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescribedTestId implements Serializable {
        @Column(name = "prescription_id")
        private Integer prescriptionId;

        @Column(name = "test_id")
        private Integer testId;
    }

}

