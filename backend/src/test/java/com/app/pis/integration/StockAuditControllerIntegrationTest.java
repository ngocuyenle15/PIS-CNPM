package com.app.pis.integration;

import com.app.pis.dto.StockAuditRequest;
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

import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class StockAuditControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = {"Admin"})
    void testCreateStartSaveAndConfirmAudit_Success() throws Exception {
        // 1. Tạo phiếu kiểm kê nháp (DRAFT)
        StockAuditRequest request = StockAuditRequest.builder()
                .auditId("AUD-INT-TEST")
                .note("Kiểm kho tích hợp")
                .build();

        mockMvc.perform(post("/api/stock-audits")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(200)))
                .andExpect(jsonPath("$.data.auditId", is("AUD-INT-TEST")))
                .andExpect(jsonPath("$.data.status", is("DRAFT")));

        // 2. Chuyển sang bắt đầu đếm kho (IN_PROGRESS)
        mockMvc.perform(patch("/api/stock-audits/AUD-INT-TEST/start")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("IN_PROGRESS")));

        // 3. Nhập số đếm thực tế (ví dụ: lô INV001 ban đầu có 100 viên, đếm thực tế thấy chỉ có 98 viên)
        StockAuditRequest.DetailRequest detail = StockAuditRequest.DetailRequest.builder()
                .inventoryId("INV001")
                .actualQuantity(98)
                .note("Hao hụt kiểm thử")
                .build();

        StockAuditRequest saveRequest = StockAuditRequest.builder()
                .details(Collections.singletonList(detail))
                .build();

        mockMvc.perform(put("/api/stock-audits/AUD-INT-TEST/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(saveRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("IN_PROGRESS")));

        // 4. Xác nhận chốt phiếu kiểm kê (CONFIRMED)
        mockMvc.perform(patch("/api/stock-audits/AUD-INT-TEST/confirm")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("CONFIRMED")));

        // 5. Kiểm tra tồn kho của lô INV001 trong MySQL đã được cập nhật về đúng 98 viên
        Inventory inventory = inventoryRepository.findById("INV001").orElseThrow();
        assertEquals(98, inventory.getStockQuantity());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"Admin"})
    void testCancelAudit_Success() throws Exception {
        StockAuditRequest request = StockAuditRequest.builder()
                .auditId("AUD-CANCEL-IT")
                .note("Kiểm kho hủy")
                .build();

        mockMvc.perform(post("/api/stock-audits")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/stock-audits/AUD-CANCEL-IT/cancel")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("CANCELLED")));
    }
}
