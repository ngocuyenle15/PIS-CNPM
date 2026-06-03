package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.GoodsIssueRequest;
import com.app.pis.dto.GoodsIssueResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Account;
import com.app.pis.entity.Employee;
import com.app.pis.repository.AccountRepository;
import com.app.pis.service.GoodsIssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goods-issues")
@RequiredArgsConstructor
public class GoodsIssueController {

    private final GoodsIssueService goodsIssueService;
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
        
        PagedResponse<GoodsIssueResponse> response = goodsIssueService.getAll(
                searchType, searchVal, startDate, endDate, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách phiếu xuất kho thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        GoodsIssueResponse response = goodsIssueService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy chi tiết phiếu xuất kho thành công"));
    }

    @PostMapping
    public ResponseEntity<?> createDraft(@Valid @RequestBody GoodsIssueRequest request) {
        Employee employee = getCurrentEmployee();
        GoodsIssueResponse response = goodsIssueService.createIssueDraft(request, employee);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo phiếu xuất kho thành công"));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String id) {
        GoodsIssueResponse response = goodsIssueService.confirmIssue(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Xác nhận xuất kho và cập nhật tồn kho thành công"));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        GoodsIssueResponse response = goodsIssueService.cancelIssue(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Hủy phiếu xuất kho thành công"));
    }
}
