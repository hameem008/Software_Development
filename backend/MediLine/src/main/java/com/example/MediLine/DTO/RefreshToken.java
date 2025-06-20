package com.example.MediLine.DTO;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "refresh_token")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(RefreshToken.RefreshTokenId.class)
public class RefreshToken {

    @Id
    @Column(nullable = false, length = 255)
    private String email;

    @Id
    @Column(nullable = false, length = 50)
    private String role;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class RefreshTokenId implements Serializable {
        private String email;
        private String role;
    }
}
