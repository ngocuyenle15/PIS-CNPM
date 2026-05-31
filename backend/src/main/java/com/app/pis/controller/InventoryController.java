package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.InventoryResponse;
import com.app.pis.dto.InventoryTransactionResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<InventoryResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String catalogId,
            @RequestParam(required = false) String originId,
            @RequestParam(required = false) Integer minStock,
            @RequestParam(required = false) Integer maxStock,
            @RequestParam(required = false) String startExpiry,
            @RequestParam(required = false) String endExpiry,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<InventoryResponse> response = inventoryService.getAll(
                search, type, catalogId, originId, minStock, maxStock, startExpiry, endExpiry, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách tồn kho lô thành công"));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponse>>> getTransactions(
            @RequestParam(required = false) String medicineId) {
        
        List<InventoryTransactionResponse> response = inventoryService.getTransactions(medicineId);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy lịch sử giao dịch thẻ kho thành công"));
    }
}
