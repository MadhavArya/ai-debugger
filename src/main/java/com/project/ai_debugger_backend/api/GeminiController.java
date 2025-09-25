package com.project.ai_debugger_backend.api;

import com.project.ai_debugger_backend.model.DebugHistory;
import com.project.ai_debugger_backend.service.GeminiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @RequestMapping("/health")
    public Map<String, String> getHealth() {
        return Map.of("status", "UP", "message", "Backend is healthy and ready!");
    }

    // New endpoint to get the history of debug requests
    @GetMapping("/history")
    public ResponseEntity<List<DebugHistory>> getHistory() {
        List<DebugHistory> history = geminiService.getDebugHistory();
        return new ResponseEntity<>(history, HttpStatus.OK);
    }

    @PostMapping("/gemini/analyze")
    public ResponseEntity<String> analyzeCode(@RequestBody Map<String, String> requestBody) {
        String code = requestBody.get("code");
        String language = requestBody.get("language");

        if (code == null || code.trim().isEmpty()) {
            return new ResponseEntity<>("Code cannot be empty.", HttpStatus.BAD_REQUEST);
        }

        if (language == null || language.trim().isEmpty()) {
            language = "code";
        }

        try {
            String geminiResponse = geminiService.analyzeCode(code, language);
            return new ResponseEntity<>(geminiResponse, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error processing request: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}