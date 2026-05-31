package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.CustomerRequest;
import com.app.pis.entity.Customer;
import com.app.pis.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAll() {
        List<Customer> response = customerService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách khách hàng thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getById(@PathVariable String id) {
        Customer response = customerService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin khách hàng thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> create(@Valid @RequestBody CustomerRequest request) {
        Customer response = customerService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo khách hàng thành công"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> patch(@PathVariable String id, @Valid @RequestBody CustomerRequest request) {
        Customer response = customerService.patch(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật thông tin khách hàng thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        customerService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa khách hàng thành công"));
    }
}
