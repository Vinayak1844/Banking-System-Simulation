package com.bankingSimulationSystem.workFlow.controller;

import com.bankingSimulationSystem.workFlow.entity.Account;
import com.bankingSimulationSystem.workFlow.entity.User;
import com.bankingSimulationSystem.workFlow.repository.AccountRepository;
import com.bankingSimulationSystem.workFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @GetMapping("/users")
    public List<User> allUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/accounts")
    public List<Account> allAccounts(){
        return accountRepository.findAll();
    }
}
