package com.bankingSimulationSystem.workFlow.repository;

import com.bankingSimulationSystem.workFlow.entity.Account;
import com.bankingSimulationSystem.workFlow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface AccountRepository extends JpaRepository<Account,Long> {
    List<Account> findByUser (User user);
}
