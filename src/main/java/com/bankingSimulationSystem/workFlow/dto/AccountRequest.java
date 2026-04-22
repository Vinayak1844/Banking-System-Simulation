package com.bankingSimulationSystem.workFlow.dto;

import com.bankingSimulationSystem.workFlow.entity.AccountType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccountRequest {
    @NotBlank(message = "Account type required")
    private AccountType accountType;
}
