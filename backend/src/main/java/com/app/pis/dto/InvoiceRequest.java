package com.app.pis.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceRequest {
    private String customerId;
    private String address;
    private String paymentMethod; // Cash, Card
    private List<DetailRequest> details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailRequest {
        private String inventoryId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String transactionUnitId;
        private Integer conversionRate;
        private String note;
    }
}

