package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory", indexes = {
    @Index(name = "idx_inventory_medicine_id", columnList = "medicine_id"),
    @Index(name = "idx_inventory_batch_id", columnList = "batch_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Inventory {
    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "batch_id")
    private String batchId;

    @Column(name = "importPrice", precision = 10, scale = 2, nullable = false)
    private BigDecimal importPrice;

    @Column(name = "stockQuantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "expiryDate")
    private LocalDate expiryDate;

    @Column(name = "manufactured_date")
    private LocalDate manufacturedDate;


    public enum InventoryStatus {
        ACTIVE,
        SOLD_OUT,
        DISPOSED,
        ADJUSTED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private InventoryStatus status = InventoryStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "medicine_id", referencedColumnName = "medicineID", nullable = false )
    private Medicine medicine;
}

