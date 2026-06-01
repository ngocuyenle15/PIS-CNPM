package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.CatalogRequest;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Catalog;
import com.app.pis.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogs")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        if (page != null) {
            PagedResponse<Catalog> response = catalogService.getAll(page, size, search);
            return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách danh mục thuốc phân trang thành công"));
        }
        List<Catalog> response = catalogService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách danh mục thuốc thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Catalog response = catalogService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy thông tin danh mục thuốc thành công"));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CatalogRequest request) {
        Catalog response = catalogService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo danh mục thuốc thành công"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable String id, @Valid @RequestBody CatalogRequest request) {
        Catalog response = catalogService.patch(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Cập nhật danh mục thuốc thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        catalogService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa danh mục thuốc thành công"));
    }
}
