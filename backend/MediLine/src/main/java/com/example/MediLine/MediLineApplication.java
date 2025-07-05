package com.example.MediLine;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MediLineApplication {

	public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .directory("./backend/MediLine")
                .load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        SpringApplication.run(MediLineApplication.class, args);
    }
}