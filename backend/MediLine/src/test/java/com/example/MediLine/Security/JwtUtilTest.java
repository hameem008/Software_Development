package com.example.MediLine.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;
    private final String jwtSecret = "ZGVmYXVsdFRlc3RTZWNyZXRLZXlGb3JUZXN0aW5nUHVycG9zZXNXaGljaElzTG9uZ0Vub3VnaA==";
    private final long jwtExpiration = 3600000;
    private final long jwtRefreshExpiration = 604800000; // 7 days

    private Key secretKey;

    @BeforeEach
    public void setUp() {
        // Create JwtUtil instance and set the private fields using reflection
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", jwtSecret);
        ReflectionTestUtils.setField(jwtUtil, "expiration", jwtExpiration);
        ReflectionTestUtils.setField(jwtUtil, "refreshExpiration", jwtRefreshExpiration);

        // Create the secret key for validation (same as JwtUtil uses)
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        secretKey = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    @Test
    void testGenerateAccessToken_Success() {
        String email = "test@example.com";
        String role = "ROLE_USER";

        String token = jwtUtil.generateAccessToken(email, role);

        assertNotNull(token);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        assertEquals(email, claims.getSubject());
        assertEquals(role, claims.get("role"));
        assertNotNull(claims.getId());
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
        assertTrue(claims.getExpiration().getTime() <= System.currentTimeMillis() + jwtExpiration);
    }

    @Test
    void testGenerateRefreshToken_Success() {
        String email = "test@example.com";
        String role = "ROLE_USER";

        String token = jwtUtil.generateRefreshToken(email, role);

        assertNotNull(token);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        assertEquals(email, claims.getSubject());
        assertEquals(role, claims.get("role"));
        assertNotNull(claims.getId());
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
        assertTrue(claims.getExpiration().getTime() <= System.currentTimeMillis() + jwtRefreshExpiration);
    }

    @Test
    void testValidateToken_ValidToken() {
        String email = "test@example.com";
        String role = "ROLE_USER";
        String token = jwtUtil.generateAccessToken(email, role);

        boolean isValid = jwtUtil.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    void testValidateToken_ExpiredToken() {
        String email = "test@example.com";
        String role = "ROLE_USER";
        String token = Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date(System.currentTimeMillis() - 7200000)) // 2 hours ago
                .setExpiration(new Date(System.currentTimeMillis() - 3600000)) // 1 hour ago
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        boolean isValid = jwtUtil.validateToken(token);

        assertFalse(isValid);
    }

    @Test
    void testValidateToken_InvalidSignature() {
        String email = "test@example.com";
        String role = "ROLE_USER";
        // Create a different valid base64 encoded secret
        String differentSecret = "YW5vdGhlclRlc3RTZWNyZXRLZXlGb3JUZXN0aW5nUHVycG9zZXNXaGljaElzTG9uZ0Vub3VnaA==";
        byte[] differentKeyBytes = Base64.getDecoder().decode(differentSecret);
        Key differentKey = new SecretKeySpec(differentKeyBytes, SignatureAlgorithm.HS256.getJcaName());

        String token = Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(differentKey, SignatureAlgorithm.HS256)
                .compact();

        boolean isValid = jwtUtil.validateToken(token);

        assertFalse(isValid);
    }

    @Test
    void testGetEmailFromToken() {
        String email = "test@example.com";
        String role = "ROLE_USER";
        String token = jwtUtil.generateAccessToken(email, role);

        String extractedEmail = jwtUtil.getEmailFromToken(token);

        assertEquals(email, extractedEmail);
    }

    @Test
    void testGetRoleFromToken() {
        String email = "test@example.com";
        String role = "ROLE_USER";
        String token = jwtUtil.generateAccessToken(email, role);

        String extractedRole = jwtUtil.getRoleFromToken(token);

        assertEquals(role, extractedRole);
    }
}