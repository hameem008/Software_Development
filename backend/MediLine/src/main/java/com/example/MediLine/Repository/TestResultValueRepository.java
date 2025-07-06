package com.example.MediLine.Repository;


import com.example.MediLine.Entity.TestResultValue;
import com.example.MediLine.Entity.TestResultValue.TestResultKey;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultValueRepository extends JpaRepository<TestResultValue, TestResultKey> {
    List<TestResultValue> findByPerformedTest_PerformedTestId(Integer performedTestId);
}
