package com.bankingSimulationSystem.workFlow.service;

import com.bankingSimulationSystem.workFlow.dto.TransactionResponse;
import com.bankingSimulationSystem.workFlow.entity.Account;
import com.bankingSimulationSystem.workFlow.entity.Transaction;
import com.bankingSimulationSystem.workFlow.entity.TransactionType;
import com.bankingSimulationSystem.workFlow.entity.User;
import com.bankingSimulationSystem.workFlow.exception.BadRequestException;
import com.bankingSimulationSystem.workFlow.exception.ResourceNotFoundException;
import com.bankingSimulationSystem.workFlow.repository.AccountRepository;
import com.bankingSimulationSystem.workFlow.repository.TransactionRepository;
import com.bankingSimulationSystem.workFlow.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service @RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;

    public List<TransactionResponse> getMyTransactions(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByEmail(email).orElseThrow();

        List<Transaction> txns = transactionRepo.findByFromAccount_UserOrToAccount_User(user,user);

        return txns.stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public void deposit(Long accId,double amount){
        if(amount <= 0){
            throw new BadRequestException("Amount must be positive");
        }

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Account acc = accountRepo.findById(accId).orElseThrow(()-> new ResourceNotFoundException("Account Not Found"));

        if (!acc.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
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
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Account acc = accountRepo.findById(accId)
                .orElseThrow();

        if (!acc.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }

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

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Account from  = accountRepo.findById(fromId).orElseThrow(()-> new ResourceNotFoundException("No 'from' acc exists"));
        Account to = accountRepo.findById(toId).orElseThrow(()-> new ResourceNotFoundException("No 'to' acc exists"));

        if (!from.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized: not your account");
        }


        if(from.getBalance() < amount) throw new BadRequestException("Insufficient Balance");

        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);
        accountRepo.save(from);
        accountRepo.save(to);

        Transaction txn = new Transaction();
        txn.setTransactionType(TransactionType.TRANSFER);
        txn.setAmount(amount);
        txn.setTimeStamp(LocalDateTime.now());
        txn.setToAccount(to);
        txn.setFromAccount(from);

        transactionRepo.save(txn);

    }

    public TransactionResponse mapToResponse(Transaction txn){
        return TransactionResponse.builder()
                .id(txn.getId())
                .type(txn.getTransactionType())
                .amount(txn.getAmount())
                .time(txn.getTimeStamp())
                .fromAccountId(
                        txn.getFromAccount() != null ? txn.getFromAccount().getId() : null
                )
                .toAccountId(
                        txn.getToAccount() != null ? txn.getToAccount().getId() : null
                )
                .build();
    }

}
