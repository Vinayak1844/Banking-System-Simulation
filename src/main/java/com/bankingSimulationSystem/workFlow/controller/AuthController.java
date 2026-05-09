package com.bankingSimulationSystem.workFlow.controller;

import com.bankingSimulationSystem.workFlow.dto.AuthRequest;
import com.bankingSimulationSystem.workFlow.entity.User;
import com.bankingSimulationSystem.workFlow.repository.UserRepository;
import com.bankingSimulationSystem.workFlow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody AuthRequest request) {

        // 1. Authenticate email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Load full user entity from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 3. Generate JWT containing email, name, and role
        String token = jwtUtil.generateToken(user);

        // 4. Return JSON response
        return new LoginResponse(token);
    }


    public record LoginResponse(String token) {
    }
}