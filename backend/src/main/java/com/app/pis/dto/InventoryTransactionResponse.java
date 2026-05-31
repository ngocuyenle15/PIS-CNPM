package com.app.pis.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransactionResponse {
    private Long id;
    private LocalDateTime transactionTime;
    private String type; // IMPORT, EXPORT, SALE, AUDIT_ADJUST
    private String referenceId;
    private String inventoryId;
    private String batchId;
    private String medicineName;
    private Integer quantityChanged;
    private Integer endingBalance;
}
