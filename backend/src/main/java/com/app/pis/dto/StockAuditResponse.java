package com.app.pis.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockAuditResponse {
    private String auditId;
    private LocalDateTime auditTime;
    private String createdByName;
    private String approvedByName;
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
        private String inventoryId;
        private String medicineName;
        private String batchId;
        private Integer systemQuantity;
        private Integer actualQuantity;
        private Integer discrepancy;
        private String note;
    }
}
