package com.app.pis.repository;

import com.app.pis.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    boolean existsByPhoneNumber(String phoneNumber);
}
