package com.app.pis.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockAuditRequest {
    private String auditId;
    private String note;
    private List<DetailRequest> details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailRequest {
        private String inventoryId;
        private Integer actualQuantity;
        private String note;
    }
}
