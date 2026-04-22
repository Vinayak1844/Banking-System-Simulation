package com.bankingSimulationSystem.workFlow.controller;


import com.bankingSimulationSystem.workFlow.dto.AccountRequest;
import com.bankingSimulationSystem.workFlow.dto.UserRequest;
import com.bankingSimulationSystem.workFlow.entity.Account;
import com.bankingSimulationSystem.workFlow.entity.User;
import com.bankingSimulationSystem.workFlow.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<Account> createAccount(@RequestBody AccountRequest request){
        Account acc = new Account();
        acc.setAccountType(request.getAccountType());
        return ResponseEntity.ok(accountService.createAccount(acc));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Account>> getMyAccounts(){
        return ResponseEntity.ok(accountService.getMyAccounts());
    }
}
