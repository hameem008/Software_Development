package com.example.MediLine.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "severity_levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeverityLevel {
    @Id
    private Integer severityLevel;

    @Column(unique = true)
    private String description;
}
