package com.app.pis.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {
    private Integer invoiceID;
    private LocalDateTime invoiceTime;
    private String customerName;
    private String address;
    private String paymentMethod;
    private String status;
    private List<DetailResponse> details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailResponse {
        private Long id;
        private String inventoryId;
        private String medicineName;
        private String batchId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subTotal;
        private String note;
    }
}

