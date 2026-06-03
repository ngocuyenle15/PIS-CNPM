package com.app.pis.repository;

import com.app.pis.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByInventoryIdOrderByTransactionTimeAsc(String inventoryId);
    List<InventoryTransaction> findByInventoryMedicineMedicineIDOrderByTransactionTimeAsc(String medicineId);
    List<InventoryTransaction> findByInventoryMedicineMedicineIDOrderByTransactionTimeDesc(String medicineId);
    List<InventoryTransaction> findAllByOrderByTransactionTimeDesc();
}
