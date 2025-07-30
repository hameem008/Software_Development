package com.example.MediLine.DTO.DoctorAuthDTO;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfileDTO {

    private String email;

    private String firstName;

    private String lastName;

    private String gender;

    private String specialization;

    private String designation;

    private String academicInstitution;

    private String phoneNumber;

    private String address;

    private String profilePhotoUrl;
}
