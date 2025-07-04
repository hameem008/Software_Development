package com.example.MediLine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
//import io.github.cdimascio.dotenv.Dotenv;  // for .env support

@SpringBootApplication
@EnableScheduling
public class MediLineApplication {

	public static void main(String[] args) {
//		Dotenv dotenv = Dotenv.configure()
//			.ignoreIfMissing()
//			.load();
//		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));

		SpringApplication.run(MediLineApplication.class, args);
	}
}