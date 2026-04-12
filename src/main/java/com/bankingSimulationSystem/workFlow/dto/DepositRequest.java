package com.bankingSimulationSystem.workFlow.dto;

import lombok.Data;

@Data
public class DepositRequest {
    private Long accountId;
    private double amount;
}
