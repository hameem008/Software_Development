package com.example.MediLine.DTO;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer doctorId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String gender;

    private String specialization;

    private String designation;

    private String academicInstitution;

    @Column(unique = true)
    private String phoneNumber;

    private String address;

    private String bio;

    private String profilePhotoUrl;
}
