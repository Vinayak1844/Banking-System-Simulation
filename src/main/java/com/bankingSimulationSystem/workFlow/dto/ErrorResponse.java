package com.bankingSimulationSystem.workFlow.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ErrorResponse {

    private String message;
    private int statusCode;
    private LocalDateTime time;
}
