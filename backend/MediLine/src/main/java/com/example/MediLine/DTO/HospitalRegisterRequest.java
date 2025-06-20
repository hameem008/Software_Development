package com.example.MediLine.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalRegisterRequest {

    private String email;

    private String password;

    private String name;

    private String description;

    private String phoneNumber;

    private String address;
}