package com.bankingSimulationSystem.workFlow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class DepositRequest {
    private Long accountId;

    @NotBlank(message = "Amount can not be Empty")
    @Positive(message =  "Amount must me greater than 0")
    private double amount;
}
