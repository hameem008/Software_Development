package com.example.MediLine.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Data
@Table(name = "doctor_degree")
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDegree {
    @EmbeddedId
    private DoctorDegreeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("doctorId")
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonBackReference
    private Doctor doctor;

    @Column(name = "institution", nullable = false, length = 255)
    private String institution;

    @Column(name = "passing_year", nullable = false)
    private Integer passingYear;


    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorDegreeId implements Serializable {

        @Column(name = "doctor_id")
        private int doctorId;

        @Column(name = "degree_name", nullable = false, length = 100)
        private String degreeName;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof DoctorDegreeId that)) return false;
            return doctorId == that.doctorId &&
                    Objects.equals(degreeName, that.degreeName);
        }

        @Override
        public int hashCode() {
            return Objects.hash(doctorId, degreeName);
        }
    }
}
