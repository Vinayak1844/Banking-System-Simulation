package com.bankingSimulationSystem.workFlow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransferRequest {

    @NotNull
    private Long fromId;
    @NotBlank
    private String receiverName;
    @Positive
    private double amount;
}
