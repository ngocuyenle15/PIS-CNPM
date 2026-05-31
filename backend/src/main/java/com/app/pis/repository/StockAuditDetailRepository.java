package com.app.pis.repository;

import com.app.pis.entity.StockAuditDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockAuditDetailRepository extends JpaRepository<StockAuditDetail, Long> {
    List<StockAuditDetail> findByAuditAuditId(String auditId);
}
