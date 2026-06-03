package com.app.pis.integration;

import com.app.pis.dto.GoodsReceiptRequest;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class GoodsReceiptControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = {"Admin"})
    void testCreateAndConfirmGoodsReceipt_Success() throws Exception {
        // 1. Lập phiếu nhập kho nháp
        GoodsReceiptRequest.DetailRequest detail = GoodsReceiptRequest.DetailRequest.builder()
                .medicineId("MED001")
                .batchId("BATCH-NEW-GRIT")
                .quantity(10) // 10 hộp
                .importPrice(new BigDecimal("90000.00"))
                .expiryDate(LocalDate.now().plusYears(2))
                .manufacturedDate(LocalDate.now().minusMonths(1))
                .transactionUnitId("UNIT002") // Hộp
                .conversionRate(10) // 1 hộp = 10 viên
                .build();

        GoodsReceiptRequest request = GoodsReceiptRequest.builder()
                .receiptId("GRN-TEST-IT")
                .supplierId("SUP002")
                .note("Nhập hàng kiểm thử tích hợp")
                .details(Collections.singletonList(detail))
                .build();

        // Tạo draft
        mockMvc.perform(post("/api/goods-receipts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(200)))
                .andExpect(jsonPath("$.data.receiptId", is("GRN-TEST-IT")))
                .andExpect(jsonPath("$.data.status", is("DRAFT")));

        // 2. Xác nhận nhập kho
        mockMvc.perform(patch("/api/goods-receipts/GRN-TEST-IT/confirm")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(200)))
                .andExpect(jsonPath("$.data.status", is("CONFIRMED")));

        // 3. Kiểm chứng lô tồn kho mới được tạo trong database: 10 hộp x 10 rate = 100 viên
        boolean exists = inventoryRepository.existsById("MED001-BATCH-NEW-GRIT");
        assertTrue(exists, "Lô tồn kho mới MED001-BATCH-NEW-GRIT phải được tạo trong Database");

        Inventory inventory = inventoryRepository.findById("MED001-BATCH-NEW-GRIT").orElseThrow();
        assertEquals(100, inventory.getStockQuantity());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"Admin"})
    void testCancelGoodsReceiptDraft_Success() throws Exception {
        GoodsReceiptRequest.DetailRequest detail = GoodsReceiptRequest.DetailRequest.builder()
                .medicineId("MED001")
                .batchId("BATCH-CANCEL-IT")
                .quantity(5)
                .importPrice(new BigDecimal("10000.00"))
                .expiryDate(LocalDate.now().plusYears(1))
                .transactionUnitId("UNIT001")
                .conversionRate(1)
                .build();

        GoodsReceiptRequest request = GoodsReceiptRequest.builder()
                .receiptId("GRN-CANCEL-IT")
                .supplierId("SUP002")
                .note("Hủy phiếu test")
                .details(Collections.singletonList(detail))
                .build();

        // Tạo draft
        mockMvc.perform(post("/api/goods-receipts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Hủy draft
        mockMvc.perform(patch("/api/goods-receipts/GRN-CANCEL-IT/cancel")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("CANCELLED")));

        // Kiểm tra lô tồn kho không được phép tạo trong DB
        boolean exists = inventoryRepository.existsById("MED001-BATCH-CANCEL-IT");
        assertTrue(!exists, "Lô tồn kho không được tạo khi hủy phiếu nhập kho nháp");
    }
}
