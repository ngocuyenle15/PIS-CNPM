package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"paymentDetails"})
public class Payment {

    @Id
    @Column(name = "paymentID", length = 50)
    private String paymentID;

    @CreationTimestamp
    @Column(name = "paymentTime", nullable = false, updatable = false)
    private LocalDateTime paymentTime;

    /**
     * Quan hệ N-1 với Employee (nhân viên lập phiếu nhập hàng)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id", referencedColumnName = "employeeID", nullable = false)
    private Employee employee;

    /**
     * Quan hệ N-1 với Supplier (nhà cung cấp)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id", referencedColumnName = "supplierID", nullable = false)
    private Supplier supplier;

    @Column(name = "totalAmount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /**
     * Quan hệ 1-N với PaymentDetail
     */
    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentDetail> paymentDetails = new ArrayList<>();
}
