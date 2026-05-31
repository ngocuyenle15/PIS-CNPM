package com.app.pis.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsIssueResponse {
    private String issueId;
    private LocalDateTime issueTime;
    private String employeeName;
    private String issueType;
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
        private Integer quantity;
        private String transactionUnitName;
        private Integer conversionRate;
    }
}
