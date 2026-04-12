package com.bankingSimulationSystem.workFlow.dto;

import lombok.Data;

@Data
public class WithdrawRequest {

    private Long accountId;
    private double amount;
}
