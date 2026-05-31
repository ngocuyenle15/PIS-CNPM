package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "goods_issue_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoodsIssueDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "issue_id", nullable = false)
    private GoodsIssue issue;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "transaction_unit_id")
    private Unit transactionUnit;       // Đơn vị thực tế dùng khi xuất (ví dụ: Vỉ)

    @Column(name = "conversionRate")
    private Integer conversionRate;     // Tỉ lệ quy đổi tại thời điểm xuất (ví dụ: 10 viên/vỉ)
}

//    private BigDecimal unitPrice;   // Snapshot giá bán tại thời điểm xuất

