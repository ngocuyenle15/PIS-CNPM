package com.app.pis.repository;

import com.app.pis.entity.StockAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockAuditRepository extends JpaRepository<StockAudit, String> {
}
