package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.dto.UnitRequest;
import com.app.pis.entity.Unit;
import com.app.pis.service.UnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        if (page != null) {
            PagedResponse<Unit> response = unitService.getAll(page, size, search);
            return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách đơn vị tính phân trang thành công"));
        }
        List<Unit> response = unitService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách đơn vị tính thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Unit>> getById(@PathVariable String id) {
        Unit response = unitService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin đơn vị tính thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Unit>> create(@Valid @RequestBody UnitRequest request) {
        Unit response = unitService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo đơn vị tính thành công"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Unit>> patch(@PathVariable String id, @Valid @RequestBody UnitRequest request) {
        Unit response = unitService.patch(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật đơn vị tính thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        unitService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa đơn vị tính thành công"));
    }
}
