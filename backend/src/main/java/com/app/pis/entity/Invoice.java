package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoice")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"invoiceDetails"})
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoiceID")
    private Integer invoiceID;

    @CreationTimestamp
    @Column(name = "invoiceTime", nullable = false, updatable = false)
    private LocalDateTime invoiceTime;

    /**
     * Quan hệ N-1 với Customer (khách hàng được xuất hóa đơn)
     */
    @ManyToOne(optional = true)
    @JoinColumn(name = "customer_id", referencedColumnName = "customerID", nullable = true)
    private Customer customer;

    @Column(name = "address", columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(name = "paymentMethod", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "status", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    /**
     * Quan hệ 1-N với InvoiceDetail
     */
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceDetail> invoiceDetails = new ArrayList<>();

    public enum PaymentMethod {
        Cash, Card
    }

    public enum InvoiceStatus {
        Paid, Pending
    }
}
