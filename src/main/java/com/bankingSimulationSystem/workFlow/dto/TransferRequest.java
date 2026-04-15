package com.bankingSimulationSystem.workFlow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransferRequest {

    private Long fromId;
    private Long toId;

    @NotNull(message = "Amount required")
    @Min(value = 1,message = "Amount must be greater than 0")
    private double amount;
}
