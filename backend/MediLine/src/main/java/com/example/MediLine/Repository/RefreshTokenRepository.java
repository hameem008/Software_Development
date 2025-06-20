package com.example.MediLine.Repository;

import com.example.MediLine.DTO.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, RefreshToken.RefreshTokenId> {

    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.email = :email AND rt.role = :role")
    void deleteByEmailAndRole(@Param("email") String email, @Param("role") String role);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryDate < :now")
    void deleteByExpiryDateBefore(@Param("now") Instant now);
}
