package com.bankingSimulationSystem.workFlow.controller;

import com.bankingSimulationSystem.workFlow.dto.DepositRequest;
import com.bankingSimulationSystem.workFlow.dto.TransferRequest;
import com.bankingSimulationSystem.workFlow.dto.WithdrawRequest;
import com.bankingSimulationSystem.workFlow.entity.Transaction;
import com.bankingSimulationSystem.workFlow.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/account/{id}")
    public List<Transaction> getTransaction(@PathVariable Long id){
        return transactionService.getAccountsTransactions(id);
    }

    @GetMapping("/welcome")
    public String welcome(){
        return "Welcome to Transactions";
    }

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@RequestBody DepositRequest request){
        transactionService.deposit(request.getAccountId(), request.getAmount());

        return ResponseEntity.ok("Deposit Successfull");
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestBody WithdrawRequest request){
        transactionService.withdraw(request.getAccountId(), request.getAmount());

        return ResponseEntity.ok("Withdrawl Successfull");
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@Valid @RequestBody TransferRequest request){
        transactionService.transfer(request.getFromId(), request.getToId(), request.getAmount());

        return ResponseEntity.ok("Transfer Successfull");
    }
}
