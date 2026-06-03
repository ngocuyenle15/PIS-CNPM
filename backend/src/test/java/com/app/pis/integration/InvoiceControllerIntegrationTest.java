package com.app.pis.integration;

import com.app.pis.dto.InvoiceRequest;
import com.app.pis.entity.Inventory;
import com.app.pis.repository.InventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class InvoiceControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "sales", roles = {"Sales"})
    void testCreateInvoice_Success() throws Exception {
        // Lấy tồn kho trước khi bán của lô INV001
        Inventory before = inventoryRepository.findById("INV001")
                .orElseThrow(() -> new AssertionError("INV001 should be seeded by DataInitializer"));
        int quantityBefore = before.getStockQuantity();

        // 1. Chuẩn bị request bán lẻ 5 viên thuốc từ lô INV001
        InvoiceRequest.DetailRequest detail = new InvoiceRequest.DetailRequest();
        detail.setInventoryId("INV001");
        detail.setQuantity(5);
        detail.setUnitPrice(new BigDecimal("15000.00"));
        detail.setConversionRate(1);
        detail.setNote("Bán 5 viên kiểm thử tích hợp");

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId(""); // Khách lẻ vãng lai
        request.setAddress("Tại quầy");
        request.setPaymentMethod("Cash");
        request.setDetails(List.of(detail));

        // 2. Thực hiện gọi API POST /api/invoices
        mockMvc.perform(post("/api/invoices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(200)))
                .andExpect(jsonPath("$.data.invoiceID", notNullValue()))
                .andExpect(jsonPath("$.data.customerName", is("Khách lẻ vãng lai")))
                .andExpect(jsonPath("$.data.paymentMethod", is("Cash")));

        // 3. Kiểm chứng dữ liệu tồn kho thực tế bị trừ đi 5 viên
        Inventory after = inventoryRepository.findById("INV001").orElseThrow();
        assertEquals(quantityBefore - 5, after.getStockQuantity());
    }

    @Test
    @WithMockUser(username = "sales", roles = {"Sales"})
    void testCreateInvoice_InsufficientStock_ThrowsException() throws Exception {
        // Chuẩn bị request bán 9999 viên (chắc chắn vượt quá lượng tồn kho)
        InvoiceRequest.DetailRequest detail = new InvoiceRequest.DetailRequest();
        detail.setInventoryId("INV001");
        detail.setQuantity(9999);
        detail.setUnitPrice(new BigDecimal("15000.00"));
        detail.setConversionRate(1);

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId("");
        request.setAddress("Tại quầy");
        request.setPaymentMethod("Cash");
        request.setDetails(List.of(detail));

        // Mong đợi lỗi 400 Bad Request / 500 Internal Error tùy exception handler
        mockMvc.perform(post("/api/invoices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is(400)))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("không đủ tồn kho")));
    }
}
