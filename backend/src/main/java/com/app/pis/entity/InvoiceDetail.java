package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "invoice_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InvoiceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Quan hệ N-1 với Invoice
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "invoice_id", referencedColumnName = "invoiceID", nullable = false)
    private Invoice invoice;

    /**
     * Quan hệ N-1 với Inventory (Lô thuốc bán)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_id", referencedColumnName = "id", nullable = false)
    private Inventory inventory;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unitPrice", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "note", length = 255)
    private String note;
}

