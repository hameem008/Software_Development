package com.example.MediLine.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mood_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoodOption {
    @Id
    private String moodValue;

    private Integer displayOrder;
}
