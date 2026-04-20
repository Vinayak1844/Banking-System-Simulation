package com.bankingSimulationSystem.workFlow.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
