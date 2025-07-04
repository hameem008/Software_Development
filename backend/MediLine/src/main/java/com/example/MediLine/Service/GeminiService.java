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

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

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
            logger.warn("Prompt is null or empty");
            return "Error: Prompt cannot be empty";
        }

        String apiUrl = geminiApiUrl + "?key=" + geminiApiKey;
        logger.info("Sending request to Gemini API");

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

        int maxRetries = 3;
        int retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                ResponseEntity<Map> responseEntity = restTemplate.postForEntity(apiUrl, request, Map.class);
                logger.info("Received response from Gemini API with status: {}", responseEntity.getStatusCode());

                Map<String, Object> body = responseEntity.getBody();
                if (body == null) {
                    logger.error("Response body is null");
                    return "Error: No response from Gemini API";
                }

                logger.debug("Full response body: {}", body);

                // Check for error in response
                if (body.containsKey("error")) {
                    Map<String, Object> error = (Map<String, Object>) body.get("error");
                    String errorMessage = error.get("message").toString();
                    logger.error("Gemini API error: {}", errorMessage);
                    return "Error: " + errorMessage;
                }

                if (!body.containsKey("candidates")) {
                    logger.warn("No candidates found in response: {}", body);
                    return "Error: No valid response from Gemini API";
                }

                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (candidates == null || candidates.isEmpty()) {
                    logger.warn("Candidates list is empty");
                    return "Error: No candidates in response";
                }

                Map<String, Object> firstCandidate = candidates.get(0);

                // Check if content was blocked
                if (firstCandidate.containsKey("finishReason") &&
                        "SAFETY".equals(firstCandidate.get("finishReason"))) {
                    logger.warn("Content was blocked by safety filters");
                    return "Error: Content was blocked by safety filters";
                }

                Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                if (content == null) {
                    logger.warn("Content is null in first candidate");
                    return "Error: No content in response";
                }

                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                if (parts == null || parts.isEmpty()) {
                    logger.warn("Parts list is empty");
                    return "Error: No parts in response";
                }

                String responseText = parts.get(0).get("text");
                if (responseText == null || responseText.isEmpty()) {
                    logger.warn("Response text is null or empty");
                    return "Error: No response text found";
                }

                logger.info("Successfully parsed response with {} characters", responseText.length());
                return responseText;

            } catch (RestClientException e) {
                retryCount++;
                logger.error("Error on attempt {}: {}", retryCount, e.getMessage());
                if (retryCount >= maxRetries) {
                    logger.error("Max retries reached, giving up");
                    return "Error talking to Gemini API: " + e.getMessage();
                }
                try {
                    Thread.sleep(1000L * retryCount); // Exponential backoff
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    logger.error("Retry interrupted: {}", ie.getMessage());
                    return "Error: Retry interrupted";
                }
            }
        }

        return "Error: Unable to get response from Gemini API";
    }
}