package com.app.pis.controller;

import com.app.pis.dto.ApiResponse;
import com.app.pis.dto.InvoiceRequest;
import com.app.pis.dto.InvoiceResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<InvoiceResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<InvoiceResponse> response = invoiceService.getAll(search, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy danh sách hóa đơn bán lẻ thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getById(@PathVariable Integer id) {
        InvoiceResponse response = invoiceService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lấy chi tiết hóa đơn bán lẻ thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponse>> create(@Valid @RequestBody InvoiceRequest request) {
        InvoiceResponse response = invoiceService.createInvoice(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo hóa đơn và trừ tồn kho lô thành công"));
    }
}
