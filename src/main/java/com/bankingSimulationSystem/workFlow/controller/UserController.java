package com.bankingSimulationSystem.workFlow.controller;

import com.bankingSimulationSystem.workFlow.dto.UserRequest;
import com.bankingSimulationSystem.workFlow.entity.User;
import com.bankingSimulationSystem.workFlow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> create(@Valid @RequestBody UserRequest request){

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return ResponseEntity.ok(userService.createUser(user));
    }
}
