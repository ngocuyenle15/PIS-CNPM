package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.SupplierRequest;
import com.app.pis.entity.Supplier;
import com.app.pis.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Supplier>>> getAll() {
        List<Supplier> response = supplierService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách nhà cung cấp thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> getById(@PathVariable String id) {
        Supplier response = supplierService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin nhà cung cấp thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Supplier>> create(@Valid @RequestBody SupplierRequest request) {
        Supplier response = supplierService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo nhà cung cấp thành công"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> patch(@PathVariable String id, @Valid @RequestBody SupplierRequest request) {
        Supplier response = supplierService.patch(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật thông tin nhà cung cấp thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        supplierService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa nhà cung cấp thành công"));
    }
}
