package com.bankingSimulationSystem.workFlow.service;

import com.bankingSimulationSystem.workFlow.entity.Account;
import com.bankingSimulationSystem.workFlow.entity.Transaction;
import com.bankingSimulationSystem.workFlow.entity.TransactionType;
import com.bankingSimulationSystem.workFlow.exception.BadRequestException;
import com.bankingSimulationSystem.workFlow.exception.ResourceNotFoundException;
import com.bankingSimulationSystem.workFlow.repository.AccountRepository;
import com.bankingSimulationSystem.workFlow.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service @RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;

    @Transactional
    public void deposit(Long accId,double amount){
        Account acc = accountRepo.findById(accId).orElseThrow(()-> new ResourceNotFoundException("Account Not Found"));

        if(amount <= 0){
            throw new BadRequestException("Amount must be positive");
        }
        acc.setBalance(acc.getBalance() + amount);


        Transaction txn = new Transaction();
        txn.setTransactionType(TransactionType.DEPOSIT);
        txn.setAmount(amount);
        txn.setTimeStamp(LocalDateTime.now());
        txn.setToAccount(acc);

        transactionRepo.save(txn);
    }

    @Transactional
    public void withdraw(Long accId,double amount){

        if(amount <= 0){
            throw new BadRequestException("Invalid amount");
        }

        Account acc = accountRepo.findById(accId)
                .orElseThrow();

        if(acc.getBalance() < amount){
            throw new BadRequestException("Insufficient Balance");
        }

        acc.setBalance(acc.getBalance() - amount);

        Transaction txn = new Transaction();
        txn.setTransactionType(TransactionType.WITHDRAW);
        txn.setAmount(amount);
        txn.setTimeStamp(LocalDateTime.now());
        txn.setFromAccount(acc);

        transactionRepo.save(txn);
    }

    @Transactional
    public void transfer(Long fromId,Long toId,double amount){

        if(fromId.equals(toId)){
            throw new BadRequestException("Cannot transfer to same account");
        }

        if(amount <= 0){
            throw new BadRequestException("Invalid amount");
        }

        Account from  = accountRepo.findById(fromId).orElseThrow(()-> new ResourceNotFoundException("No 'from' acc exists"));
        Account to = accountRepo.findById(toId).orElseThrow(()-> new ResourceNotFoundException("No 'to' acc exists"));



        if(from.getBalance() < amount) throw new BadRequestException("Insufficient Balance");

        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);

        Transaction txn = new Transaction();
        txn.setTransactionType(TransactionType.TRANSFER);
        txn.setAmount(amount);
        txn.setTimeStamp(LocalDateTime.now());
        txn.setToAccount(to);
        txn.setFromAccount(from);

        transactionRepo.save(txn);

    }
}
