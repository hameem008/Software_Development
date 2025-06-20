package com.example.MediLine.Security;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Base64;

public class SecretKeyGenerator {
    public static void main(String[] args) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSha256");
        SecretKey secretKey = keyGen.generateKey();
        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());

        System.out.println("Generated JWT Secret Key:");
        System.out.println(encodedKey);
    }
}