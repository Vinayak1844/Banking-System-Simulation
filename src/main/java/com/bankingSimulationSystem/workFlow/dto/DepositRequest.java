package com.bankingSimulationSystem.workFlow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepositRequest {
    private Long accountId;

    @NotBlank(message = "Amount can not be Empty")
    private double amount;
}
