package com.app.pis.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {
    private String id;
    private String batchId;
    private BigDecimal importPrice;
    private Integer stockQuantity;
    private LocalDate expiryDate;
    private LocalDate manufacturedDate;
    private String status;
    private MedicineResponse medicine;
}


