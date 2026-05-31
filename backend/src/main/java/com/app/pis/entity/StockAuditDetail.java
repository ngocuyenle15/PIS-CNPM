package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stock_audit_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StockAuditDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "audit_id", nullable = false)
    private StockAudit audit;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    /** Tồn sổ sách — snapshot khi tạo phiếu, không được phép thay đổi */
    @Column(name = "systemQuantity", nullable = false)
    private Integer systemQuantity;

    /** Số lượng đếm thực tế — nhân viên nhập */
    @Column(name = "actualQuantity")
    private Integer actualQuantity;

    /**
     * Chênh lệch = actualQuantity - systemQuantity
     * > 0: thừa | < 0: thiếu | = 0: khớp
     * Tính tự động tại service layer trước khi save
     */
    @Column(name = "discrepancy")
    private Integer discrepancy;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
}
