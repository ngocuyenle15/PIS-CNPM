package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicines_supplier")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Supplier {

    @Id
    @Column(name = "supplierID", length = 50)
    private String supplierID;

    @Column(name = "supplierName", length = 255, unique = true, nullable = false)
    private String supplierName;

    @Column(name = "phoneNumber", length = 15, unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "address", columnDefinition = "TEXT", nullable = false)
    private String address;
}
