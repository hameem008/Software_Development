package com.example.MediLine.Controller;

import com.example.MediLine.Service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
        System.out.println("api hit");
        logger.info("Received chat request");

        // Validate request structure
        if (request == null) {
            logger.warn("Invalid request: request is null");
            return ResponseEntity.badRequest().body(Map.of("error", "Request cannot be null"));
        }

        // Check if it's a simple message or conversation history
        if (request.containsKey("message") && request.get("message") instanceof String) {
            // Handle simple message (backward compatibility)
            return handleSimpleMessage(request);
        } else if (request.containsKey("conversationHistory") && request.get("conversationHistory") instanceof List) {
            // Handle conversation with context
            return handleConversationWithContext(request);
        } else {
            logger.warn("Invalid request: neither message nor conversationHistory found");
            return ResponseEntity.badRequest().body(Map.of("error", "Either 'message' or 'conversationHistory' is required"));
        }
    }

    private ResponseEntity<Map<String, String>> handleSimpleMessage(Map<String, Object> request) {
        String message = (String) request.get("message");
        if (message == null || message.trim().isEmpty()) {
            logger.warn("Invalid request: message is missing or empty");
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required and cannot be empty"));
        }

        logger.info("Processing simple message with {} characters", message.length());

        try {
            String reply = geminiService.getGeminiResponse(message);

            if (reply.startsWith("Error:")) {
                logger.error("Error response from Gemini service: {}", reply);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", reply));
            }

            logger.info("Successfully processed simple chat request");
            return ResponseEntity.ok(Map.of("response", reply));

        } catch (Exception e) {
            logger.error("Error processing simple chat request: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process request: " + e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private ResponseEntity<Map<String, String>> handleConversationWithContext(Map<String, Object> request) {
        List<Map<String, String>> conversationHistory = (List<Map<String, String>>) request.get("conversationHistory");

        if (conversationHistory == null || conversationHistory.isEmpty()) {
            logger.warn("Invalid request: conversationHistory is missing or empty");
            return ResponseEntity.badRequest().body(Map.of("error", "Conversation history is required and cannot be empty"));
        }

        // Validate conversation history format
        for (Map<String, String> message : conversationHistory) {
            if (!message.containsKey("role") || !message.containsKey("message")) {
                logger.warn("Invalid conversation history format: missing role or message");
                return ResponseEntity.badRequest().body(Map.of("error", "Each message must contain 'role' and 'message' fields"));
            }

            String role = message.get("role");
            if (!"user".equals(role) && !"model".equals(role)) {
                logger.warn("Invalid role in conversation history: {}", role);
                return ResponseEntity.badRequest().body(Map.of("error", "Role must be either 'user' or 'model'"));
            }
        }

        logger.info("Processing conversation with {} messages", conversationHistory.size());

        try {
            String reply = geminiService.getGeminiResponseWithContext(conversationHistory);

            if (reply.startsWith("Error:")) {
                logger.error("Error response from Gemini service: {}", reply);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", reply));
            }

            logger.info("Successfully processed conversation request");
            return ResponseEntity.ok(Map.of("response", reply));

        } catch (Exception e) {
            logger.error("Error processing conversation request: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process request: " + e.getMessage()));
        }
    }
}