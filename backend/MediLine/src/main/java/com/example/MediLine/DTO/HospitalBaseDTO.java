package com.example.MediLine.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalBaseDTO {
    private Integer hospitalId;
    private String name;
    private String address;
}