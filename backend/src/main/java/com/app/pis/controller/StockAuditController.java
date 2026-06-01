package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.dto.StockAuditRequest;
import com.app.pis.dto.StockAuditResponse;
import com.app.pis.entity.Account;
import com.app.pis.entity.Employee;
import com.app.pis.repository.AccountRepository;
import com.app.pis.service.StockAuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-audits")
@RequiredArgsConstructor
public class StockAuditController {

    private final StockAuditService stockAuditService;
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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<StockAuditResponse> response = stockAuditService.getAll(
                searchType, searchVal, startDate, endDate, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách phiếu kiểm kê kho thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        StockAuditResponse response = stockAuditService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy chi tiết phiếu kiểm kê kho thành công"));
    }

    @PostMapping
    public ResponseEntity<?> createDraft(@Valid @RequestBody StockAuditRequest request) {
        Employee employee = getCurrentEmployee();
        StockAuditResponse response = stockAuditService.createAuditDraft(request, employee);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo nháp phiếu kiểm kê kho thành công"));
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<?> startCount(@PathVariable String id) {
        StockAuditResponse response = stockAuditService.startAuditCount(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Bắt đầu thực hiện kiểm kho thành công"));
    }

    @PutMapping("/{id}/items")
    public ResponseEntity<?> saveItemsDraft(
            @PathVariable String id, 
            @Valid @RequestBody StockAuditRequest request) {
        
        StockAuditResponse response = stockAuditService.saveAuditDraftQuantity(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Lưu số thực tế đếm tạm thời thành công"));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String id) {
        Employee employee = getCurrentEmployee();
        StockAuditResponse response = stockAuditService.confirmAudit(id, employee);
        return ResponseEntity.ok(ApiResponse.success(response, "Xác nhận đối soát hoàn thành kiểm kê và cập nhật tồn kho thành công"));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        StockAuditResponse response = stockAuditService.cancelAudit(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Hủy phiếu kiểm kê thành công"));
    }
}
