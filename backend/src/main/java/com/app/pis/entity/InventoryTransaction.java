package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transaction", indexes = {
    @Index(name = "idx_inv_trans_inv_id_time", columnList = "inventory_id, transaction_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_time", nullable = false)
    private LocalDateTime transactionTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private TransactionType type;

    @Column(name = "reference_id", length = 50, nullable = false)
    private String referenceId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_id", referencedColumnName = "id", nullable = false)
    private Inventory inventory;

    @Column(name = "quantity_changed", nullable = false)
    private Integer quantityChanged;    // Lượng biến động: âm khi xuất, dương khi nhập

    @Column(name = "ending_balance", nullable = false)
    private Integer endingBalance;      // Số tồn cuối cùng của lô sau giao dịch

    public enum TransactionType {
        IMPORT, EXPORT, SALE, AUDIT_ADJUST
    }
}
