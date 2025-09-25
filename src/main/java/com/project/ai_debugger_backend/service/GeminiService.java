package com.project.ai_debugger_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.ai_debugger_backend.model.DebugHistory;
import com.project.ai_debugger_backend.repository.DebugHistoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
public class GeminiService {

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final DebugHistoryRepository debugHistoryRepository;

    @Value("${google.api.key}")
    private String apiKey;

    public GeminiService(DebugHistoryRepository debugHistoryRepository) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
        this.debugHistoryRepository = debugHistoryRepository;
    }

    public String analyzeCode(String code, String language) throws IOException, InterruptedException {
        // Correctly escape special characters for JSON.
        String escapedCode = code.replace("\\", "\\\\").replace("\"", "\\\"");

        String jsonPayload = String.format("""
            {
              "contents": [
                {
                  "parts": [
                    {
                      "text": "Analyze the following %s code snippet and provide a brief explanation of any bugs or issues, and suggest a corrected version. \\n\\n```%s\\n%s\\n```"
                    }
                  ]
                }
              ]
            }
            """, language, "\n", escapedCode); // Use the escapedCode variable here.

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GEMINI_API_URL + "?key=" + apiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini API call failed with status code: " + response.statusCode() + " and body: " + response.body());
        }

        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode firstCandidateText = rootNode.at("/candidates/0/content/parts/0/text");

        if (firstCandidateText.isMissingNode()) {
            throw new RuntimeException("Could not find generated text in Gemini API response.");
        }

        String geminiResponse = firstCandidateText.asText();

        DebugHistory history = new DebugHistory(code, language, geminiResponse);
        debugHistoryRepository.save(history);

        return geminiResponse;
    }
    public List<DebugHistory> getDebugHistory() {
        return debugHistoryRepository.findAll();
    }
}