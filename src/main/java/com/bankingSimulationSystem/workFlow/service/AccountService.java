package com.bankingSimulationSystem.workFlow.service;

import com.bankingSimulationSystem.workFlow.entity.Account;
import com.bankingSimulationSystem.workFlow.entity.User;
import com.bankingSimulationSystem.workFlow.repository.AccountRepository;
import com.bankingSimulationSystem.workFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository repo;
    private final UserRepository userRepo;

    public Account createAccount (String email,Account account){
        User user = userRepo.findByEmail(email).orElseThrow(()-> new RuntimeException("User Not Found"));
        account.setUser(user);
        account.setBalance(0);
        account.setAccountNumber(UUID.randomUUID().toString());
        return repo.save(account);
    }
//        public Account createAccount(String email, Account account) {
//
//            System.out.println("EMAIL RECEIVED = " + email);
//
//            User user = userRepo.findByEmail(email)
//                    .orElseThrow(() -> new RuntimeException("USER NOT FOUND"));
//
//            System.out.println("USER FOUND = " + user.getName());
//
//            account.setUser(user);
//            account.setBalance(0);
//            account.setAccountNumber(UUID.randomUUID().toString());
//
//            return repo.save(account);
//        }

    public List<Account> getAccounts(String email){
        User user = userRepo.findByEmail(email).orElseThrow();
        return repo.findByUser(user);
    }
}
