package com.app.pis.repository;

import com.app.pis.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
}
