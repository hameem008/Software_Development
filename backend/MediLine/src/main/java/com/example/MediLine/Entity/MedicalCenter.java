package com.example.MediLine.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;


@Entity
@Table(name = "medical_center")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer medicalCenterId;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(unique = true)
    private String phoneNumber;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @OneToMany(mappedBy = "medicalCenter", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference
    List<DoctorAvailability> doctorAvailabilities;

}