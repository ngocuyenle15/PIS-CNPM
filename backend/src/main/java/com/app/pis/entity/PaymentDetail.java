package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "payment_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentDetail {

    /**
     * Composite PK: (payment_id, medicine_id)
     * Thể hiện ràng buộc unique_together = ('payment', 'medicine') trong Django
     */
    @EmbeddedId
    private PaymentDetailId id;

    /**
     * Quan hệ N-1 với Payment
     */
    @ManyToOne(optional = false)
    @MapsId("paymentId")
    @JoinColumn(name = "payment_id", referencedColumnName = "paymentID", nullable = false)
    private Payment payment;

    /**
     * Quan hệ N-1 với Medicine
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
