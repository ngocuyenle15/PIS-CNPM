package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "medicine", indexes = {
    @Index(name = "idx_medicine_name", columnList = "medicineName"),
    @Index(name = "idx_medicine_catalog_id", columnList = "catalog_id"),
    @Index(name = "idx_medicine_origin_id", columnList = "origin_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Medicine {

    @Id
    @Column(name = "medicineID", length = 50)
    private String medicineID;

    @Column(name = "medicineName", length = 255, nullable = false)
    private String medicineName;

    /**
     * Lưu đường dẫn ảnh (tương đương ImageField của Django upload_to='medicines/')
     */
    @Column(name = "image", length = 500)
    private String image;

    @Column(name = "ingredients", columnDefinition = "TEXT", nullable = false)
    private String ingredients;

    /**
     * Quan hệ N-1 với Unit (đơn vị tính)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "unit_id", referencedColumnName = "unitID", nullable = false)
    private Unit baseUnit;

    /**
     * Quan hệ N-1 với Catalog (danh mục thuốc)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "catalog_id", referencedColumnName = "catalogID", nullable = false)
    private Catalog catalog;

    /**
     * Quan hệ N-1 với Origin (xuất xứ)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "origin_id", referencedColumnName = "originID", nullable = false)
    private Origin origin;



    @Column(name = "unitPrice", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;


}
