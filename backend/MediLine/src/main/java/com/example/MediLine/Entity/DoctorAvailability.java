package com.example.MediLine.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Table(name = "doctor_availability")
@Getter
@Setter
public class DoctorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Integer slotId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonBackReference
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medical_center_id", nullable = false)
    @JsonManagedReference
    private MedicalCenter medicalCenter;

    @Column(name = "week_day", nullable = false, length = 20)
    private String weekDay;

    @Column(name = "start_time", nullable = false, columnDefinition = "TIME")
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false, columnDefinition = "TIME")
    private LocalTime endTime;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Column(name = "visit_capacity", nullable = false)
    private Integer visitCapacity;

    @Column(name = "fee", nullable = false)
    private Integer visitFee;

    @Column(name = "chamber", nullable = false, length = 255)
    private String chamber;


    // Getters & setters
}

