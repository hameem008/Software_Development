package com.example.MediLine.Repository;

import com.example.MediLine.Entity.MoodOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoodOptionRepository extends JpaRepository<MoodOption, String> {
    List<MoodOption> findAllByOrderByDisplayOrderAsc();
}
