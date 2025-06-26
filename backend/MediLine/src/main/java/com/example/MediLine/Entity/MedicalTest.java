package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tests")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MedicalTest {
    @Id
    @Column(name = "test_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer testId;

    @Column(name = "test_name", unique = true, nullable = false)
    private String name;
}
