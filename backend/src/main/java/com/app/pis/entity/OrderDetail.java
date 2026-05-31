package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sales_orderdetail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderDetail {

    /**
     * Composite PK: (order_id, medicine_id)
     * Thể hiện ràng buộc unique_together = ('order', 'medicine') trong Django
     */
    @EmbeddedId
    private OrderDetailId id;

    /**
     * Quan hệ N-1 với Order (đơn hàng chứa chi tiết này)
     * MapsId ánh xạ trường orderId trong OrderDetailId → FK order_id
     */
    @ManyToOne(optional = false)
    @MapsId("orderId")
    @JoinColumn(name = "order_id", referencedColumnName = "orderID", nullable = false)
    private Order order;

    /**
     * Quan hệ N-1 với Medicine (thuốc trong đơn hàng)
     * MapsId ánh xạ trường medicineId trong OrderDetailId → FK medicine_id
     */
    @ManyToOne(optional = false)
    @MapsId("medicineId")
    @JoinColumn(name = "medicine_id", referencedColumnName = "medicineID", nullable = false)
    private Medicine medicine;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unitPrice", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;
}
