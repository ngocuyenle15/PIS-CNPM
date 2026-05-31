package com.app.pis.repository;

import com.app.pis.entity.GoodsReceiptDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsReceiptDetailRepository extends JpaRepository<GoodsReceiptDetail, Long> {
    List<GoodsReceiptDetail> findByReceiptReceiptId(String receiptId);
}
