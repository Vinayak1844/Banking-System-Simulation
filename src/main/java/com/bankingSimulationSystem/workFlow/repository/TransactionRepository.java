package com.bankingSimulationSystem.workFlow.repository;

import com.bankingSimulationSystem.workFlow.entity.Account;
import com.bankingSimulationSystem.workFlow.entity.Transaction;
import com.bankingSimulationSystem.workFlow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    List<Transaction> findByFromAccount_UserOrToAccount_User(User user1,User user2);
}
