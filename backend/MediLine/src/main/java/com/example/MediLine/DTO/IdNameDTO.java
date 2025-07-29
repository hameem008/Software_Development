package com.example.MediLine.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class IdNameDTO {
    private Integer id;
    private String name;
}
