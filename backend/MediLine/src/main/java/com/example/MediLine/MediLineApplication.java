package com.example.MediLine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MediLineApplication {

	public static void main(String[] args) {
		SpringApplication.run(MediLineApplication.class, args);
	}
}