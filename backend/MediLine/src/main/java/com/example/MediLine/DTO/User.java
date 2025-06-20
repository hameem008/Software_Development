package com.example.MediLine.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    private String id;

    private String name;

    private String email;

    private String type;

    private String avatar;

}