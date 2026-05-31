package com.app.pis.repository;

import com.app.pis.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {
    Optional<Supplier> findBySupplierName(String supplierName);
    boolean existsBySupplierName(String supplierName);
    boolean existsByPhoneNumber(String phoneNumber);
}
