package com.bankingSimulationSystem.workFlow.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private double amount;
    private LocalDateTime timeStamp;

    @ManyToOne
    private Account toAccount;

    @ManyToOne
    private Account fromAccount;
}
