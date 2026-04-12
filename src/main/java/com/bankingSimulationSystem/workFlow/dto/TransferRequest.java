package com.bankingSimulationSystem.workFlow.dto;

import lombok.Data;

@Data
public class TransferRequest {

    private Long fromId;
    private Long toId;
    private double amount;
}
