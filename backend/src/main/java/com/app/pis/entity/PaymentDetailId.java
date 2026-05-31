package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

/**
 * Embedded composite primary key cho PaymentDetail.
 * Ràng buộc unique_together ('payment', 'medicine') trong Django
 * → composite PK trong JPA.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PaymentDetailId implements Serializable {

    @Column(name = "payment_id", length = 50)
    private String paymentId;

    @Column(name = "medicine_id", length = 50)
    private String medicineId;
}
