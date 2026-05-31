package com.app.pis.repository;

import com.app.pis.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, String> {
    List<Inventory> findByMedicineMedicineID(String medicineID);
    List<Inventory> findByBatchId(String batchId);
}
