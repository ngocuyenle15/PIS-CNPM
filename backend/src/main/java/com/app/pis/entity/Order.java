package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_order")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"orderDetails"})
public class Order {

    @Id
    @Column(name = "orderID", length = 50)
    private String orderID;

    @CreationTimestamp
    @Column(name = "orderTime", nullable = false, updatable = false)
    private LocalDateTime orderTime;

    /**
     * Quan hệ N-1 với Employee (nhân viên tạo đơn hàng)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id", referencedColumnName = "employeeID", nullable = false)
    private Employee employee;

    /**
     * Quan hệ N-1 với Customer (khách hàng đặt hàng)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", referencedColumnName = "customerID", nullable = false)
    private Customer customer;

    @Column(name = "totalAmount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /**
     * Quan hệ 1-N với OrderDetail
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();
}
