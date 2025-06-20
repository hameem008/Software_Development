package com.example.MediLine.DTO;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRegisterRequest {

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String gender;

    private LocalDate dateOfBirth;

    private String bloodGroup;

    private String phoneNumber;

    private String address;
}
