package com.example.MediLine.Controller;

import com.example.MediLine.DTO.DoctorBaseDTO;
import com.example.MediLine.DTO.MedicalHistoryDTO.SymptomDTO;
import com.example.MediLine.Repository.DoctorRepository;
import com.example.MediLine.Repository.SymptomRepository;
import com.example.MediLine.Service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final GeminiService geminiService;
    private final SymptomRepository symptomRepository;
    private final DoctorRepository doctorRepository;

    // Valid specializations list
    private static final Set<String> VALID_SPECIALIZATIONS = Set.of(
            "Immunology", "Anesthesiology", "Cardiology", "Dermatology",
            "Endocrinology", "Gastroenterology", "Gynecology", "Hematology",
            "Nephrology", "Neurology", "Oncology", "Ophthalmology",
            "Orthopedics", "Otolaryngology", "Pediatrics", "Psychiatry",
            "Pulmonology", "Radiology", "Urology", "Medicine"
    );

    // Message type enum
    public enum MessageType {
        GENERAL,
        SYMPTOM_RELATED,
        RECOMMENDATION_RELATED
    }

    public List<SymptomDTO> getLatestFiveSymptoms(Integer patientId) {
        List<SymptomDTO> ret = symptomRepository.findSymptomsByPatientId(patientId)
                .stream()
                .limit(5)
                .map(s -> new SymptomDTO(
                        s.getDescription(),
                        s.getSymptomId().getDate(),
                        s.getSymptomId().getTime(),
                        s.getOverallMood(),
                        s.getSeverityLevel()
                ))
                .toList();
        return ret;
    }

    public List<DoctorBaseDTO> getLatestFiveDoctorsBySpecialization(String specialization) {
        List<DoctorBaseDTO> ret = doctorRepository.findDoctorsBySpecialization(specialization)
                .stream()
                .limit(5)
                .map(doctor -> new DoctorBaseDTO(
                        doctor.getDoctorId(),
                        (doctor.getFirstName() != null ? doctor.getFirstName() : "") + " " +
                                (doctor.getLastName() != null ? doctor.getLastName() : ""),
                        doctor.getSpecialization() != null ? doctor.getSpecialization() : "",
                        doctor.getDesignation() != null ? doctor.getDesignation() : "",
                        doctor.getAcademicInstitution() != null ? doctor.getAcademicInstitution() : ""
                ))
                .toList();
        return ret;
    }

    /**
     * Use LLM to classify the message type intelligently
     */
    private MessageType classifyMessageWithLLM(String message) {
        if (message == null || message.trim().isEmpty()) {
            return MessageType.GENERAL;
        }

        try {
            // Create a classification prompt for the LLM
            String classificationPrompt = "Classify the following user message into one of these categories and respond with ONLY the category name followed by your analysis:\n\n" +
                    "Categories:\n" +
                    "- GENERAL: General health questions, greetings, or conversations not specifically about symptoms or doctor recommendations\n" +
                    "- SYMPTOM_RELATED: User is describing symptoms, health problems, feeling unwell, or asking about their health condition\n" +
                    "- RECOMMENDATION_RELATED: User is asking for doctor recommendations, wants to book appointments, or looking for specific medical specialists\n\n" +
                    "User message: \"" + message + "\"\n\n" +
                    "Respond in this format: [CATEGORY_NAME]. [Your brief analysis]";

            List<Map<String, String>> classificationHistory = new ArrayList<>();
            classificationHistory.add(Map.of("role", "user", "message", classificationPrompt));

            String response = geminiService.getGeminiResponseWithContext(classificationHistory);

            if (response != null && !response.startsWith("Error:")) {
                String upperResponse = response.toUpperCase();

                if (upperResponse.startsWith("SYMPTOM_RELATED") || upperResponse.contains("SYMPTOM_RELATED.")) {
                    logger.info("LLM classified message as SYMPTOM_RELATED: {}", message.substring(0, Math.min(50, message.length())));
                    return MessageType.SYMPTOM_RELATED;
                } else if (upperResponse.startsWith("RECOMMENDATION_RELATED") || upperResponse.contains("RECOMMENDATION_RELATED.")) {
                    logger.info("LLM classified message as RECOMMENDATION_RELATED: {}", message.substring(0, Math.min(50, message.length())));
                    return MessageType.RECOMMENDATION_RELATED;
                } else if (upperResponse.startsWith("GENERAL") || upperResponse.contains("GENERAL.")) {
                    logger.info("LLM classified message as GENERAL: {}", message.substring(0, Math.min(50, message.length())));
                    return MessageType.GENERAL;
                }
            }

            logger.warn("Could not parse LLM classification response, defaulting to GENERAL. Response: {}", response);

        } catch (Exception e) {
            logger.error("Error in LLM classification, falling back to pattern matching: {}", e.getMessage());
        }

        // Fallback to pattern matching if LLM classification fails
        return classifyMessageWithPatterns(message);
    }

    /**
     * Fallback pattern-based classification
     */
    private MessageType classifyMessageWithPatterns(String message) {
        if (message == null || message.trim().isEmpty()) {
            return MessageType.GENERAL;
        }

        String lowerMessage = message.toLowerCase();

        // Simple keyword-based classification as fallback
        if (lowerMessage.contains("doctor") || lowerMessage.contains("appointment") ||
                lowerMessage.contains("specialist") || lowerMessage.contains("visit") ||
                lowerMessage.contains("consultation") || lowerMessage.contains("recommend")) {
            return MessageType.RECOMMENDATION_RELATED;
        }

        if (lowerMessage.contains("pain") || lowerMessage.contains("sick") ||
                lowerMessage.contains("symptom") || lowerMessage.contains("hurt") ||
                lowerMessage.contains("fever") || lowerMessage.contains("headache") ||
                lowerMessage.contains("not feeling well") || lowerMessage.contains("unwell")) {
            return MessageType.SYMPTOM_RELATED;
        }

        return MessageType.GENERAL;
    }

    /**
     * Extract specialization from user message using LLM
     */
    private String extractSpecializationWithLLM(String message) {
        try {
            // Create specializations list for the prompt
            String specializationsList = String.join(", ", VALID_SPECIALIZATIONS);

            String extractionPrompt = "Extract the medical specialization mentioned in the following message. " +
                    "If no specific specialization is mentioned, respond with 'Medicine'. " +
                    "Available specializations: " + specializationsList + ". " +
                    "Respond with ONLY the exact specialization name from the list above. " +
                    "If the user mentions a doctor type that corresponds to a specialization (like 'cardiologist' for 'Cardiology'), " +
                    "return the corresponding specialization name.\n\n" +
                    "Message: \"" + message + "\"";

            List<Map<String, String>> extractionHistory = new ArrayList<>();
            extractionHistory.add(Map.of("role", "user", "message", extractionPrompt));

            String response = geminiService.getGeminiResponseWithContext(extractionHistory);

            if (response != null && !response.startsWith("Error:")) {
                String cleanResponse = response.trim();

                // Check if the response matches any valid specialization (case-insensitive)
                for (String specialization : VALID_SPECIALIZATIONS) {
                    if (cleanResponse.equalsIgnoreCase(specialization)) {
                        logger.info("LLM extracted specialization: {} from message: {}", specialization,
                                message.substring(0, Math.min(50, message.length())));
                        return specialization;
                    }
                }

                logger.warn("LLM returned invalid specialization: {}, defaulting to Medicine", cleanResponse);
            }
        } catch (Exception e) {
            logger.error("Error in LLM specialization extraction: {}", e.getMessage());
        }

        // Fallback to default specialization
        logger.info("Falling back to default specialization: Medicine");
        return "Medicine";
    }

    /**
     * Build enhanced conversation with intelligent context injection
     */
    private List<Map<String, String>> buildEnhancedConversation(
            List<Map<String, String>> originalHistory,
            MessageType messageType,
            Integer patientId,
            String userMessage) {

        List<Map<String, String>> enhancedHistory = new ArrayList<>(originalHistory);

        // Add contextual information based on message type
        if (messageType == MessageType.SYMPTOM_RELATED && patientId != null) {
            List<SymptomDTO> symptoms = getLatestFiveSymptoms(patientId);
            if (!symptoms.isEmpty()) {
                StringBuilder contextMessage = new StringBuilder();
                contextMessage.append("SYSTEM CONTEXT - Patient's Recent Medical History: ");
                contextMessage.append("The patient has the following recent symptoms on record: ");

                for (int i = 0; i < symptoms.size(); i++) {
                    SymptomDTO symptom = symptoms.get(i);
                    contextMessage.append(String.format("(%d) %s recorded on %s at %s, severity level %d/10, mood: %s",
                            i + 1, symptom.getDescription(), symptom.getDate(),
                            symptom.getTime(), symptom.getSeverityLevel(), symptom.getOverallMood()));
                    if (i < symptoms.size() - 1) {
                        contextMessage.append("; ");
                    }
                }

                contextMessage.append(". Use this information to provide more personalized and relevant advice, " +
                        "but do not explicitly mention that you have access to this historical data.");

                // Insert system context before the latest user message
                Map<String, String> systemContext = new HashMap<>();
                systemContext.put("role", "model");
                systemContext.put("message", contextMessage.toString());
                enhancedHistory.add(enhancedHistory.size() - 1, systemContext);

                logger.info("Added symptom context for patient: {} with {} symptoms", patientId, symptoms.size());
            }
        } else if (messageType == MessageType.RECOMMENDATION_RELATED) {
            String specialization = extractSpecializationWithLLM(userMessage);
            List<DoctorBaseDTO> doctors = getLatestFiveDoctorsBySpecialization(specialization);

            if (!doctors.isEmpty()) {
                StringBuilder contextMessage = new StringBuilder();
                contextMessage.append("SYSTEM CONTEXT - Available Medical Professionals: ");
                contextMessage.append(String.format("Here are qualified %s specialists available for consultation: ", specialization));

                for (int i = 0; i < doctors.size(); i++) {
                    DoctorBaseDTO doctor = doctors.get(i);
                    contextMessage.append(String.format("(%d) Dr. %s, %s, affiliated with %s (ID: %d)",
                            i + 1, doctor.getName(), doctor.getDesignation(),
                            doctor.getAcademicInstitution(), doctor.getDoctorId()));
                    if (i < doctors.size() - 1) {
                        contextMessage.append("; ");
                    }
                }

                contextMessage.append(". Present these doctors naturally to the patient and help them choose based on their needs. " +
                        "You can mention their qualifications and affiliations to help with decision-making.");

                // Insert system context before the latest user message
                Map<String, String> systemContext = new HashMap<>();
                systemContext.put("role", "model");
                systemContext.put("message", contextMessage.toString());
                enhancedHistory.add(enhancedHistory.size() - 1, systemContext);

                logger.info("Added doctor recommendation context for specialization: {} with {} doctors", specialization, doctors.size());
            } else {
                // Add context even when no doctors are found
                Map<String, String> systemContext = new HashMap<>();
                systemContext.put("role", "model");
                systemContext.put("message", String.format("SYSTEM CONTEXT: No %s specialists are currently available in our database. " +
                        "Please inform the patient politely and suggest they check back later or contact our support team for assistance.", specialization));
                enhancedHistory.add(enhancedHistory.size() - 1, systemContext);
            }
        }

        // Add message type specific system instructions
        String typeSpecificInstruction = getTypeSpecificInstruction(messageType);
        if (!typeSpecificInstruction.isEmpty()) {
            Map<String, String> instructionContext = new HashMap<>();
            instructionContext.put("role", "model");
            instructionContext.put("message", typeSpecificInstruction);
            enhancedHistory.add(enhancedHistory.size() - 1, instructionContext);
        }

        return enhancedHistory;
    }

    /**
     * Get message type specific instructions
     */
    private String getTypeSpecificInstruction(MessageType messageType) {
        switch (messageType) {
            case SYMPTOM_RELATED:
                return "SYSTEM INSTRUCTION: The user is discussing symptoms or health concerns. Your role is to: " +
                        "1) Provide empathetic and supportive responses " +
                        "2) Offer practical symptom management advice " +
                        "3) Suggest possible conditions (while emphasizing these are not diagnoses) " +
                        "4) Recommend appropriate medical tests when relevant " +
                        "5) Suggest consulting specific medical specialists " +
                        "6) Always emphasize the importance of professional medical consultation for serious concerns " +
                        "7) Use any available patient history to provide more personalized advice " +
                        "Remember: You are not providing medical diagnoses, only supportive information and guidance.";

            case RECOMMENDATION_RELATED:
                return "SYSTEM INSTRUCTION: The user is seeking doctor recommendations or appointment assistance. Your role is to: " +
                        "1) Present available doctors in a helpful and organized manner " +
                        "2) Highlight their qualifications and specializations " +
                        "3) Help the user understand which doctor might be best for their needs " +
                        "4) Provide guidance on appointment booking if applicable " +
                        "5) Be encouraging and supportive about seeking medical care " +
                        "Present the information naturally and help guide them to make an informed choice.";

            case GENERAL:
            default:
                return "SYSTEM INSTRUCTION: This is a general health-related conversation. Your role is to: " +
                        "1) Provide accurate, helpful health information " +
                        "2) Maintain a professional, caring, and empathetic tone " +
                        "3) Encourage healthy lifestyle choices " +
                        "4) Always recommend consulting healthcare professionals for specific medical concerns " +
                        "5) Be supportive and informative while staying within appropriate bounds " +
                        "Keep the conversation engaging and helpful while prioritizing user safety and well-being.";
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
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
            // Use LLM-based classification
            MessageType messageType = classifyMessageWithLLM(message);
            Integer patientId = extractPatientId(request);
            System.out.println("here is the patient id: " + patientId);

            // For simple messages, create a minimal conversation history
            List<Map<String, String>> conversationHistory = new ArrayList<>();
            conversationHistory.add(Map.of("role", "user", "message", message));

            // Enhance conversation based on message type
            List<Map<String, String>> enhancedHistory = buildEnhancedConversation(conversationHistory, messageType, patientId, message);

            String reply = geminiService.getGeminiResponseWithContext(enhancedHistory);

            if (reply.startsWith("Error:")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", reply));
            }

            logger.info("Successfully processed simple chat request with message type: {}", messageType);
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
            // Get the latest user message for classification
            String latestUserMessage = "";
            for (int i = conversationHistory.size() - 1; i >= 0; i--) {
                if ("user".equals(conversationHistory.get(i).get("role"))) {
                    latestUserMessage = conversationHistory.get(i).get("message");
                    break;
                }
            }

            // Use LLM-based classification
            MessageType messageType = classifyMessageWithLLM(latestUserMessage);
            Integer patientId = extractPatientId(request);
            System.out.println("here is the patient id: " + patientId);

            // Build enhanced conversation with context
            List<Map<String, String>> enhancedHistory = buildEnhancedConversation(conversationHistory, messageType, patientId, latestUserMessage);

            String reply = geminiService.getGeminiResponseWithContext(enhancedHistory);

            if (reply.startsWith("Error:")) {
                logger.error("Error response from Gemini service: {}", reply);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", reply));
            }

            logger.info("Successfully processed conversation request with message type: {}", messageType);
            return ResponseEntity.ok(Map.of("response", reply));

        } catch (Exception e) {
            logger.error("Error processing conversation request: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process request: " + e.getMessage()));
        }
    }

    /**
     * Extract patient ID from request (you may need to modify this based on your auth system)
     */
    private Integer extractPatientId(Map<String, Object> request) {
        // This is a placeholder - you should extract the patient ID from your authentication context
        // or from the request parameters based on your system design
        Object patientIdObj = request.get("patientId");
        if (patientIdObj instanceof Integer) {
            return (Integer) patientIdObj;
        } else if (patientIdObj instanceof String) {
            try {
                return Integer.parseInt((String) patientIdObj);
            } catch (NumberFormatException e) {
                logger.warn("Invalid patient ID format: {}", patientIdObj);
            }
        }

        // Return a default patient ID or null - modify this based on your requirements
        // You might want to get this from JWT token or session
        return 1; // Placeholder - replace with actual patient ID extraction logic
    }
}