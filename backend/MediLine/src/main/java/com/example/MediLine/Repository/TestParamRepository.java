package com.example.MediLine.Repository;


import com.example.MediLine.Entity.TestParam;
import com.example.MediLine.Entity.TestParam.TestParamKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestParamRepository extends JpaRepository<TestParam, TestParamKey> {

    @Query("""
        SELECT tp
        FROM TestParam tp
        WHERE tp.id.testId = :testId
    """)
    List<TestParam> findByTestId(@Param("testId") Integer testId);
}
