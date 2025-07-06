package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "symptom")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Symptom {
    @EmbeddedId
    private SymptomId symptomId;

    @MapsId("patientId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "overall_mood", nullable = false)
    private String overallMood;

    @Column(name = "severity_level", nullable = false)
    private Integer severityLevel;


    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static public class SymptomId implements Serializable {
        @Column(name = "patient_id", nullable = false)
        private Integer patientId;

        @Column(name = "date", nullable = false)
        private LocalDate date;

        @Column(name = "time", nullable = false)
        private LocalTime time;
    }

}
