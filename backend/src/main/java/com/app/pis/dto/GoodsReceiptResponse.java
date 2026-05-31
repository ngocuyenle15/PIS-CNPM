package com.app.pis.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsReceiptResponse {
    private String receiptId;
    private LocalDateTime receiptTime;
    private String employeeName;
    private String supplierName;
    private String note;
    private String status;
    private List<DetailResponse> details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailResponse {
        private Long id;
        private String medicineId;
        private String medicineName;
        private String batchId;
        private Integer quantity;
        private BigDecimal importPrice;
        private LocalDate expiryDate;
        private LocalDate manufacturedDate;
        private String transactionUnitName;

        private Integer conversionRate;
    }
}
