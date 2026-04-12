package com.bankingSimulationSystem.workFlow.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(nullable = false)
    private String accountNumber;
    private double balance;

    @ManyToOne
    private User user;
}
