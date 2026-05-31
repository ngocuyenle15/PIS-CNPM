package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.OriginRequest;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Origin;
import com.app.pis.service.OriginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/origins")
@RequiredArgsConstructor
public class OriginController {

    private final OriginService originService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        if (page != null) {
            PagedResponse<Origin> response = originService.getAll(page, size, search);
            return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách xuất xứ thuốc phân trang thành công"));
        }
        List<Origin> response = originService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách xuất xứ thuốc thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Origin>> getById(@PathVariable String id) {
        Origin response = originService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin xuất xứ thuốc thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Origin>> create(@Valid @RequestBody OriginRequest request) {
        Origin response = originService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo xuất xứ thuốc thành công"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Origin>> patch(@PathVariable String id, @Valid @RequestBody OriginRequest request) {
        Origin response = originService.patch(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật xuất xứ thuốc thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        originService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa xuất xứ thuốc thành công"));
    }
}
