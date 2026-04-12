package com.bankingSimulationSystem.workFlow.dto;

import com.bankingSimulationSystem.workFlow.entity.AccountType;
import lombok.Data;

@Data
public class AccountRequest {

    private String email;
    private AccountType accountType;
}
