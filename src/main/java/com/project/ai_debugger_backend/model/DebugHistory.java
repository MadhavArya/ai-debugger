package com.project.ai_debugger_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "debug_history")
public class DebugHistory {

    @Id
    private String id;
    private String code;
    private String language;
    private String aiResponse;
    private LocalDateTime timestamp;

    // Constructors
    public DebugHistory() {
        this.timestamp = LocalDateTime.now();
    }

    public DebugHistory(String code, String language, String aiResponse) {
        this.code = code;
        this.language = language;
        this.aiResponse = aiResponse;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters (IntelliJ can generate these for you)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getAiResponse() { return aiResponse; }
    public void setAiResponse(String aiResponse) { this.aiResponse = aiResponse; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
