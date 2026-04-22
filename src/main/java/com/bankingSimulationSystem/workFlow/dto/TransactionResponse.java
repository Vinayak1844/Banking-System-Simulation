package com.bankingSimulationSystem.workFlow.dto;

import com.bankingSimulationSystem.workFlow.entity.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {

    private Long id;
    private TransactionType type;
    private double amount;
    private LocalDateTime time;

    private Long fromAccountId;
    private Long toAccountId;
}
