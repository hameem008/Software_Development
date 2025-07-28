package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "performed_tests")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PerformedTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer performedTestId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "test_id")
    private Test test;

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
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @OneToMany(mappedBy = "performedTest", cascade = CascadeType.ALL,
            fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<TestResultValue> resultValues = new HashSet<>();

}
