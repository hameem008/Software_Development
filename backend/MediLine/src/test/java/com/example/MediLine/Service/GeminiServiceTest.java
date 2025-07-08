package com.example.MediLine.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class GeminiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private GeminiService geminiService;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetGeminiResponse_Success() {
        // Arrange
        String prompt = "What is the capital of France?";
        String expectedResponse = "The capital of France is Paris.";
        String fullApiUrl = apiUrl + "?key=" + apiKey;

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("candidates", List.of(
                Map.of("content", Map.of("parts", List.of(Map.of("text", expectedResponse))))
        ));

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = geminiService.getGeminiResponse(prompt);

        // Assert
        assertEquals(expectedResponse, result);
        verify(restTemplate, times(1)).postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponse_EmptyPrompt() {
        // Arrange
        String prompt = "";

        // Act
        String result = geminiService.getGeminiResponse(prompt);

        // Assert
        assertEquals("Error: Prompt cannot be empty", result);
        verify(restTemplate, never()).postForEntity(anyString(), any(), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponse_NullPrompt() {
        // Arrange
        String prompt = null;

        // Act
        String result = geminiService.getGeminiResponse(prompt);

        // Assert
        assertEquals("Error: Prompt cannot be empty", result);
        verify(restTemplate, never()).postForEntity(anyString(), any(), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponse_ApiError() {
        // Arrange
        String prompt = "Test prompt";
        String fullApiUrl = apiUrl + "?key=" + apiKey;
        Map<String, Object> errorResponse = Map.of("error", Map.of("message", "API key invalid"));
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        when(restTemplate.postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = geminiService.getGeminiResponse(prompt);

        // Assert
        assertEquals("Error: API key invalid", result);
        verify(restTemplate, times(1)).postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponse_SafetyBlock() {
        // Arrange
        String prompt = "Inappropriate content";
        String fullApiUrl = apiUrl + "?key=" + apiKey;
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("candidates", List.of(
                Map.of("finishReason", "SAFETY", "content", Map.of("parts", List.of()))
        ));
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = geminiService.getGeminiResponse(prompt);

        // Assert
        assertEquals("Error: Content was blocked by safety filters", result);
        verify(restTemplate, times(1)).postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponse_RetryOnFailure() {
        // Arrange
        String prompt = "Test prompt";
        String fullApiUrl = apiUrl + "?key=" + apiKey;
        when(restTemplate.postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new RestClientException("Network error"))
                .thenThrow(new RestClientException("Network error"))
                .thenThrow(new RestClientException("Network error"));

        // Act
        String result = geminiService.getGeminiResponse(prompt);

        // Assert
        assertTrue(result.startsWith("Error talking to Gemini API:"));
        verify(restTemplate, times(3)).postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponseWithContext_Success() {
        // Arrange
        List<Map<String, String>> conversationHistory = List.of(
                Map.of("role", "user", "message", "Hello, how are you?"),
                Map.of("role", "model", "message", "I'm doing great, thanks!")
        );
        String expectedResponse = "Glad to hear that!";
        String fullApiUrl = apiUrl + "?key=" + apiKey;

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("candidates", List.of(
                Map.of("content", Map.of("parts", List.of(Map.of("text", expectedResponse))))
        ));

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = geminiService.getGeminiResponseWithContext(conversationHistory);

        // Assert
        assertEquals(expectedResponse, result);
        verify(restTemplate, times(1)).postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponseWithContext_EmptyHistory() {
        // Arrange
        List<Map<String, String>> conversationHistory = Collections.emptyList();

        // Act
        String result = geminiService.getGeminiResponseWithContext(conversationHistory);

        // Assert
        assertEquals("Error: Conversation history cannot be empty", result);
        verify(restTemplate, never()).postForEntity(anyString(), any(), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponseWithContext_NullHistory() {
        // Arrange
        List<Map<String, String>> conversationHistory = null;

        // Act
        String result = geminiService.getGeminiResponseWithContext(conversationHistory);

        // Assert
        assertEquals("Error: Conversation history cannot be empty", result);
        verify(restTemplate, never()).postForEntity(anyString(), any(), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponseWithContext_EmptyMessage() {
        // Arrange
        List<Map<String, String>> conversationHistory = List.of(
                Map.of("role", "user", "message", ""),
                Map.of("role", "model", "message", "   ")
        );
        String fullApiUrl = apiUrl + "?key=" + apiKey;
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("candidates", List.of(
                Map.of("content", Map.of("parts", List.of(Map.of("text", "No response for empty input"))))
        ));
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = geminiService.getGeminiResponseWithContext(conversationHistory);

        // Assert
        assertEquals("No response for empty input", result);
        verify(restTemplate, times(1)).postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    public void testGetGeminiResponseWithContext_MissingResponseContent() {
        // Arrange
        List<Map<String, String>> conversationHistory = List.of(
                Map.of("role", "user", "message", "Hello!")
        );
        String fullApiUrl = apiUrl + "?key=" + apiKey;
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("candidates", List.of(
                Map.of("content", Map.of("parts", Collections.emptyList()))
        ));
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(responseEntity);

        // Act
        String result = geminiService.getGeminiResponseWithContext(conversationHistory);

        // Assert
        assertEquals("Error: No parts in response", result);
        verify(restTemplate, times(1)).postForEntity(eq(fullApiUrl), any(HttpEntity.class), eq(Map.class));
    }
}