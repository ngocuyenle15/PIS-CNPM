package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.MedicineRequest;
import com.app.pis.dto.MedicineResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String searchField,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<MedicineResponse> response = medicineService.getAll(search, searchField, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách thuốc thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        MedicineResponse response = medicineService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin thuốc thành công"));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody MedicineRequest request) {
        MedicineResponse response = medicineService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo thông tin thuốc thành công"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable String id, @Valid @RequestBody MedicineRequest request) {
        MedicineResponse response = medicineService.patch(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật thông tin thuốc thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        medicineService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thông tin thuốc thành công"));
    }
}
