package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "goods_receipt_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceiptDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "receipt_id", nullable = false)
    private GoodsReceipt receipt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;          // ← Medicine, KHÔNG phải Inventory
    @Column(name = "batchId", length = 50)
    private String batchId;             // Mã lô (nhân viên nhập)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    @Column(name = "importPrice", precision=10, scale=2, nullable=false)
    private BigDecimal importPrice;
    @Column(name = "expiryDate")
    private LocalDate expiryDate;

    @Column(name = "manufactured_date")
    private LocalDate manufacturedDate;


    @ManyToOne
    @JoinColumn(name = "transaction_unit_id")
    private Unit transactionUnit;       // Đơn vị thực tế dùng khi nhập (ví dụ: Hộp)

    @Column(name = "conversionRate")
    private Integer conversionRate;     // Tỉ lệ quy đổi tại thời điểm nhập (ví dụ: 10 viên/hộp)
}
//    @Column(name = "expiryDate")
//    private LocalDate expiryDate;
//}
