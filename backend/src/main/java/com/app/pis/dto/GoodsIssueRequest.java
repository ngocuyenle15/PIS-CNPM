package com.app.pis.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsIssueRequest {
    private String issueId;
    private String issueType; // SALE, EXPIRED, DAMAGED, RETURN_SUPPLIER, OTHER
    private String note;
    private List<DetailRequest> details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailRequest {
        private String inventoryId;
        private Integer quantity;
        private String transactionUnitId;
        private Integer conversionRate;
    }
}
