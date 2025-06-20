package com.example.MediLine.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorRegisterRequest {

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String gender;

    private String specialization;

    private String designation;

    private String academicInstitution;

    private String phoneNumber;

    private String address;
}
