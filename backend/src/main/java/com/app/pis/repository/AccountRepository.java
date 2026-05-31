package com.app.pis.repository;

import com.app.pis.entity.Account;
import com.app.pis.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmployee(Employee employee);
    Optional<Account> findByEmployee(Employee employee);
}
