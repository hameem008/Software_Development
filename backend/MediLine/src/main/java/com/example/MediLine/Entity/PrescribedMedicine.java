package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "prescribed_medicine")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescribedMedicine {

    @EmbeddedId
    private PrescribedMedicineId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("prescriptionId")
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("medicineId")
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    private String dosage;
    private String frequency;

    @Column(name = "duration_value")
    private Integer durationValue;

    @Column(name = "duration_unit")
    private String durationUnit;

    private String instruction;


    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescribedMedicineId implements Serializable {
        @Column(name = "prescription_id")
        private Integer prescriptionId;

        @Column(name = "medicine_id")
        private Integer medicineId;
    }
}
