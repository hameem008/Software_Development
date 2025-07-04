package com.example.MediLine.Controller;

import com.example.MediLine.Service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api") // Added base path for better API organization
@RequiredArgsConstructor
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        logger.info("Received chat request");

        if (request == null || !request.containsKey("message") || request.get("message").isBlank()) {
            logger.warn("Invalid request: message is missing or empty");
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required and cannot be empty"));
        }

        String userMessage = request.get("message");
        logger.info("Processing message with {} characters", userMessage.length());

        try {
            String reply = geminiService.getGeminiResponse(userMessage);

            // Check if the response is an error
            if (reply.startsWith("Error:")) {
                logger.error("Error response from Gemini service: {}", reply);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", reply));
            }

            logger.info("Successfully processed chat request");
            return ResponseEntity.ok(Map.of("response", reply));

        } catch (Exception e) {
            logger.error("Error processing chat request: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process request: " + e.getMessage()));
        }
    }
}