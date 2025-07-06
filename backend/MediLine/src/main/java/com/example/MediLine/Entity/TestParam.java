package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "test_params")
@Data
public class TestParam {
    @EmbeddedId
    private TestParamKey id;

    private String unit;

    @Column(name = "ideal_male_range")
    private String idealMaleRange;

    @Column(name = "ideal_female_range")
    private String idealFemaleRange;

    @Column(name = "ideal_children_range")
    private String idealChildrenRange;

    @MapsId("testId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    private Test test;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestParamKey implements Serializable {
        @Column(name = "test_id")
        private Integer testId;

        @Column(name = "parameter_name")
        private String parameterName;
    }
}
