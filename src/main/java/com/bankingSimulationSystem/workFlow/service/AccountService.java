package com.bankingSimulationSystem.workFlow.service;

import com.bankingSimulationSystem.workFlow.entity.Account;
import com.bankingSimulationSystem.workFlow.entity.Transaction;
import com.bankingSimulationSystem.workFlow.entity.User;
import com.bankingSimulationSystem.workFlow.exception.BadRequestException;
import com.bankingSimulationSystem.workFlow.exception.ResourceNotFoundException;
import com.bankingSimulationSystem.workFlow.repository.AccountRepository;
import com.bankingSimulationSystem.workFlow.repository.TransactionRepository;
import com.bankingSimulationSystem.workFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository repo;
    private final UserRepository userRepo;
    private final TransactionRepository transactionRepository;

    public Account createAccount (Account account){
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        User user = userRepo.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
        account.setUser(user);
        account.setBalance(0);
        account.setAccountNumber(UUID.randomUUID().toString());
        return repo.save(account);
    }

    public List<Account> getMyAccounts(){

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return repo.findByUser(user);
    }

    @Transactional
    public void deleteMyBankAccount(Long accountId) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Account account = repo.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized: not your account");
        }

        List<Transaction> linkedTransactions =
                transactionRepository.findByFromAccountOrToAccount(account, account);

        if (!linkedTransactions.isEmpty()) {
            transactionRepository.deleteAll(linkedTransactions);
        }

        repo.delete(account);
    }
}
