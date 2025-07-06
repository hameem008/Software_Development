package com.example.MediLine.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "test_result_value")
@Data
public class TestResultValue {
    @EmbeddedId
    private TestResultKey id;

    @Column(name = "result_value")
    private String resultValue;

    @MapsId("performedTestId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_test_id")
    private PerformedTest performedTest;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestResultKey implements Serializable {
        @Column(name = "performed_test_id")
        private Integer performedTestId;

        @Column(name = "parameter_name")
        private String parameterName;
    }

}