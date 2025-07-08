package com.example.MediLine.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate;

    public GeminiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getGeminiResponse(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return "Error: Prompt cannot be empty";
        }

        String apiUrl = geminiApiUrl + "?key=" + geminiApiKey;

        // Create request body according to Gemini API format
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(Map.of("text", prompt.trim()))
                        )
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        return executeRequest(apiUrl, request);
    }

    // New method to handle conversation context
    public String getGeminiResponseWithContext(List<Map<String, String>> conversationHistory) {
        if (conversationHistory == null || conversationHistory.isEmpty()) {
            return "Error: Conversation history cannot be empty";
        }

        String apiUrl = geminiApiUrl + "?key=" + geminiApiKey;

        // Build contents array with conversation history
        List<Map<String, Object>> contents = new ArrayList<>();

        for (Map<String, String> message : conversationHistory) {
            String role = message.get("role"); // "user" or "model"
            String text = message.get("message");

            if (text != null && !text.trim().isEmpty()) {
                Map<String, Object> content = Map.of(
                        "role", role,
                        "parts", List.of(Map.of("text", text.trim()))
                );
                contents.add(content);
            }
        }

        Map<String, Object> requestBody = Map.of("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        return executeRequest(apiUrl, request);
    }

    private String executeRequest(String apiUrl, HttpEntity<Map<String, Object>> request) {
        int maxRetries = 3;
        int retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                ResponseEntity<Map> responseEntity = restTemplate.postForEntity(apiUrl, request, Map.class);

                Map<String, Object> body = responseEntity.getBody();
                if (body == null) {
                    return "Error: No response from Gemini API";
                }

                // Check for error in response
                if (body.containsKey("error")) {
                    Map<String, Object> error = (Map<String, Object>) body.get("error");
                    String errorMessage = error.get("message").toString();
                    return "Error: " + errorMessage;
                }

                if (!body.containsKey("candidates")) {
                    return "Error: No valid response from Gemini API";
                }

                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (candidates == null || candidates.isEmpty()) {
                    return "Error: No candidates in response";
                }

                Map<String, Object> firstCandidate = candidates.get(0);

                // Check if content was blocked
                if (firstCandidate.containsKey("finishReason") &&
                        "SAFETY".equals(firstCandidate.get("finishReason"))) {
                    return "Error: Content was blocked by safety filters";
                }

                Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                if (content == null) {
                    return "Error: No content in response";
                }

                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                if (parts == null || parts.isEmpty()) {
                    return "Error: No parts in response";
                }

                String responseText = parts.get(0).get("text");
                if (responseText == null || responseText.isEmpty()) {
                    return "Error: No response text found";
                }

                return responseText;

            } catch (RestClientException e) {
                retryCount++;
                if (retryCount >= maxRetries) {
                    return "Error talking to Gemini API: " + e.getMessage();
                }
                try {
                    Thread.sleep(1000L * retryCount); // Exponential backoff
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return "Error: Retry interrupted";
                }
            }
        }

        return "Error: Unable to get response from Gemini API";
    }
}