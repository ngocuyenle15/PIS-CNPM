package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

/**
 * Embedded composite primary key cho OrderDetail.
 * Ràng buộc unique_together ('order', 'medicine') trong Django
 * → composite PK trong JPA.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class OrderDetailId implements Serializable {

    @Column(name = "order_id", length = 50)
    private String orderId;

    @Column(name = "medicine_id", length = 50)
    private String medicineId;
}
