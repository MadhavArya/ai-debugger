package com.project.ai_debugger_backend.repository;


import com.project.ai_debugger_backend.model.DebugHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DebugHistoryRepository extends MongoRepository<DebugHistory, String> {
}