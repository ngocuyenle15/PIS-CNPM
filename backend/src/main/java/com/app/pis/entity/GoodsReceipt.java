package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "goods_receipt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"details"})
public class GoodsReceipt {

    @Id
    @Column(name = "receiptId", length = 50)
    private String receiptId;

    @CreationTimestamp
    @Column(name = "receiptTime", nullable = false, updatable = false)
    private LocalDateTime receiptTime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReceiptStatus status = ReceiptStatus.DRAFT;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GoodsReceiptDetail> details = new ArrayList<>();

    public enum ReceiptStatus {
        DRAFT, CONFIRMED, CANCELLED
    }
}
