package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.AccountRequest;
import com.app.pis.dto.AccountResponse;
import com.app.pis.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<AccountResponse> response = accountService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách tài khoản thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        AccountResponse response = accountService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin tài khoản thành công"));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody AccountRequest request) {
        AccountResponse response = accountService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo tài khoản thành công"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Integer id, @Valid @RequestBody AccountRequest request) {
        AccountResponse response = accountService.patch(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật tài khoản thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        accountService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa tài khoản thành công"));
    }
}
