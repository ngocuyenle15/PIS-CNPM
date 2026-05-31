package com.app.pis.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsReceiptRequest {
    private String receiptId;
    private String supplierId;
    private String note;
    private List<DetailRequest> details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailRequest {
        private String medicineId;
        private String batchId;
        private Integer quantity;
        private BigDecimal importPrice;
        private LocalDate expiryDate;
        private LocalDate manufacturedDate;
        private String transactionUnitId;

        private Integer conversionRate;
    }
}
