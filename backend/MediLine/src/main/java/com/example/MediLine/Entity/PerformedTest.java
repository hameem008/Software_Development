package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "performed_tests")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PerformedTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer performedTestId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "test_id")
    private MedicalTest test;

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    @Column(name = "note")
    private String note;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "performed_by_doctor_id")
    private Doctor performedByDoctor;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "reviewed_by_doctor_id")
    private Doctor reviewedByDoctor;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "medical_center_id")
    private MedicalCenter medicalCenter;

}
