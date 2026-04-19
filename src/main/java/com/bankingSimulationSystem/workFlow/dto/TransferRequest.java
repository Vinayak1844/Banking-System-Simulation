package com.bankingSimulationSystem.workFlow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransferRequest {

    @NotNull
    private Long fromId;
    @NotNull
    private Long toId;
    @Positive
    private double amount;
}
