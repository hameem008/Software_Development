package com.example.MediLine.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.modelmapper.ModelMapper;

@Configuration
public class AppConfig {

    // Password encoder bean to hash passwords (used for login/registration)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Optional: ModelMapper for mapping between DTOs and entities
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
