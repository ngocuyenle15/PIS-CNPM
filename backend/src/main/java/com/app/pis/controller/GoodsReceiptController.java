package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.GoodsReceiptRequest;
import com.app.pis.dto.GoodsReceiptResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Account;
import com.app.pis.entity.Employee;
import com.app.pis.repository.AccountRepository;
import com.app.pis.service.GoodsReceiptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goods-receipts")
@RequiredArgsConstructor
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;
    private final AccountRepository accountRepository;

    private Employee getCurrentEmployee() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản người dùng: " + username));
        return account.getEmployee();
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchVal,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<GoodsReceiptResponse> response = goodsReceiptService.getAll(
                searchType, searchVal, startDate, endDate, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách phiếu nhập kho thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        GoodsReceiptResponse response = goodsReceiptService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy chi tiết phiếu nhập kho thành công"));
    }

    @PostMapping
    public ResponseEntity<?> createDraft(@Valid @RequestBody GoodsReceiptRequest request) {
        Employee employee = getCurrentEmployee();
        GoodsReceiptResponse response = goodsReceiptService.createReceiptDraft(request, employee);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo nháp phiếu nhập kho thành công"));
    }

    @Transactional
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String id) {
        GoodsReceiptResponse response = goodsReceiptService.confirmReceipt(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Xác nhận nhập kho và cập nhật tồn kho thành công"));
    }

    @Transactional
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        GoodsReceiptResponse response = goodsReceiptService.cancelReceipt(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Hủy phiếu nhập kho thành công"));
    }
}
