package com.bankingSimulationSystem.workFlow.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Getter @Setter
public class Account {

    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    private String accountNumber;
    private double balance;

    @ManyToOne
    private User userp;
}
