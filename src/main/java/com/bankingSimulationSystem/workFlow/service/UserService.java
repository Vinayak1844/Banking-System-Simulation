package com.bankingSimulationSystem.workFlow.service;

import com.bankingSimulationSystem.workFlow.entity.User;
import com.bankingSimulationSystem.workFlow.exception.ResourceNotFoundException;
import com.bankingSimulationSystem.workFlow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    public User createUser(User user){
        return userRepo.save(user);
    }

    public User getByEmail(String email){
        return userRepo.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User Not Found"));
    }
}
