package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.EmployeeRequest;
import com.app.pis.dto.EmployeeWithAccountRequest;
import com.app.pis.dto.EmployeeWithAccountResponse;
import com.app.pis.entity.Employee;
import com.app.pis.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Employee> response = employeeService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách nhân viên thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Employee response = employeeService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin nhân viên thành công"));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody EmployeeRequest request) {
        Employee response = employeeService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo hồ sơ nhân viên thành công"));
    }

    @PostMapping("/with-account")
    public ResponseEntity<?> createWithAccount(
            @Valid @RequestBody EmployeeWithAccountRequest request) {
        EmployeeWithAccountResponse response = employeeService.createWithAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo hồ sơ nhân viên và tài khoản thành công"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable String id, @Valid @RequestBody EmployeeRequest request) {
        Employee response = employeeService.patch(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật hồ sơ nhân viên thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        employeeService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa hồ sơ nhân viên thành công"));
    }
}
