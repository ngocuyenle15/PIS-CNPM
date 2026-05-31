package com.app.pis.service;

import com.app.pis.entity.*;
import com.app.pis.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventoryAndSalesServiceTest {

    @Mock
    private GoodsReceiptRepository goodsReceiptRepository;

    @Mock
    private GoodsReceiptDetailRepository goodsReceiptDetailRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private InventoryTransactionRepository inventoryTransactionRepository;

    @Mock
    private GoodsIssueRepository goodsIssueRepository;

    @Mock
    private GoodsIssueDetailRepository goodsIssueDetailRepository;

    @InjectMocks
    private GoodsReceiptService goodsReceiptService;

    @InjectMocks
    private GoodsIssueService goodsIssueService;

    private Medicine medicine;
    private GoodsReceipt receipt;
    private GoodsReceiptDetail receiptDetail;
    private Inventory inventory;

    @BeforeEach
    void setUp() {
        Unit baseUnit = new Unit();
        baseUnit.setUnitID("TAB");
        baseUnit.setUnitName("Viên");

        medicine = new Medicine();
        medicine.setMedicineID("MED-111");
        medicine.setMedicineName("Paracetamol 500mg");
        medicine.setBaseUnit(baseUnit);
        medicine.setUnitPrice(new BigDecimal("1000.00"));

        receipt = new GoodsReceipt();
        receipt.setReceiptId("GRN-TEST-123");
        receipt.setStatus(GoodsReceipt.ReceiptStatus.DRAFT);
        receipt.setEmployee(new Employee()); // Mock employee
        receipt.getEmployee().setFullName("Dược sĩ A");
        receipt.setSupplier(new Supplier()); // Mock supplier
        receipt.getSupplier().setSupplierName("Dược phẩm TW1");
        receipt.setNote("Nhập hàng test");

        receiptDetail = new GoodsReceiptDetail();
        receiptDetail.setId(1L);
        receiptDetail.setReceipt(receipt);
        receiptDetail.setMedicine(medicine);
        receiptDetail.setBatchId("LOT-ABC");
        receiptDetail.setQuantity(5); // 5 hộp
        receiptDetail.setImportPrice(new BigDecimal("8000.00"));
        receiptDetail.setExpiryDate(LocalDate.now().plusYears(2));
        receiptDetail.setConversionRate(10); // 1 hộp = 10 viên -> 50 viên gốc

        receipt.setDetails(Collections.singletonList(receiptDetail));

        inventory = new Inventory();
        inventory.setId("MED-111-LOT-ABC");
        inventory.setBatchId("LOT-ABC");
        inventory.setMedicine(medicine);
        inventory.setImportPrice(new BigDecimal("8000.00"));
        inventory.setExpiryDate(LocalDate.now().plusYears(2));
        inventory.setStockQuantity(20); // Tồn kho ban đầu: 20 viên
    }

    // =========================================================================
    // TESTS FOR GOODS RECEIPTS (NHẬP KHO & QUY ĐỔI)
    // =========================================================================

    @Test
    void testConfirmReceipt_Success_NewInventory() {
        // Mock khi chưa có lô hàng này trong kho
        when(goodsReceiptRepository.findById("GRN-TEST-123")).thenReturn(Optional.of(receipt));
        when(inventoryRepository.findById("MED-111-LOT-ABC")).thenReturn(Optional.empty());
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(goodsReceiptRepository.save(any(GoodsReceipt.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Thực hiện confirm
        var response = goodsReceiptService.confirmReceipt("GRN-TEST-123");

        // Kiểm tra kết quả
        assertNotNull(response);
        assertEquals("CONFIRMED", response.getStatus());

        // Kiểm tra tồn kho mới được tạo đúng logic quy đổi: 5 hộp x 10 = 50 viên
        verify(inventoryRepository).save(argThat(inv -> {
            assertEquals("MED-111-LOT-ABC", inv.getId());
            assertEquals("LOT-ABC", inv.getBatchId());
            assertEquals(50, inv.getStockQuantity());
            return true;
        }));

        verify(inventoryTransactionRepository, times(1)).save(any(InventoryTransaction.class));
    }

    @Test
    void testConfirmReceipt_Success_AccumulateInventory() {
        // Mock khi đã có lô hàng này trong kho -> Cộng dồn tồn
        when(goodsReceiptRepository.findById("GRN-TEST-123")).thenReturn(Optional.of(receipt));
        when(inventoryRepository.findById("MED-111-LOT-ABC")).thenReturn(Optional.of(inventory)); // Đang có 20 viên
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(goodsReceiptRepository.save(any(GoodsReceipt.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Thực hiện confirm
        goodsReceiptService.confirmReceipt("GRN-TEST-123");

        // Kiểm tra cộng dồn: 20 viên cũ + (5 hộp x 10) = 70 viên mới
        verify(inventoryRepository).save(argThat(inv -> {
            assertEquals(70, inv.getStockQuantity());
            return true;
        }));
    }

    @Test
    void testConfirmReceipt_InvalidStateTransition() {
        // Giả lập trạng thái đã khóa (CONFIRMED)
        receipt.setStatus(GoodsReceipt.ReceiptStatus.CONFIRMED);
        when(goodsReceiptRepository.findById("GRN-TEST-123")).thenReturn(Optional.of(receipt));

        // Thực hiện confirm -> Phải ném ra IllegalStateException
        assertThrows(IllegalStateException.class, () -> {
            goodsReceiptService.confirmReceipt("GRN-TEST-123");
        });

        verify(inventoryRepository, never()).save(any(Inventory.class));
    }

    // =========================================================================
    // TESTS FOR GOODS ISSUES (XUẤT KHO & RÀNG BUỘC TỒN)
    // =========================================================================

    @Test
    void testConfirmIssue_Success() {
        GoodsIssue issue = new GoodsIssue();
        issue.setIssueId("GIN-TEST-999");
        issue.setStatus(GoodsIssue.IssueStatus.DRAFT);
        issue.setIssueType(GoodsIssue.IssueType.EXPIRED);
        issue.setEmployee(receipt.getEmployee());

        GoodsIssueDetail issueDetail = new GoodsIssueDetail();
        issueDetail.setId(1L);
        issueDetail.setIssue(issue);
        issueDetail.setInventory(inventory); // Có sẵn 20 viên
        issueDetail.setQuantity(1); // Xuất 1 hộp
        issueDetail.setConversionRate(10); // 1 hộp = 10 viên -> Xuất 10 viên

        issue.setDetails(Collections.singletonList(issueDetail));

        when(goodsIssueRepository.findById("GIN-TEST-999")).thenReturn(Optional.of(issue));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(goodsIssueRepository.save(any(GoodsIssue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Thực hiện confirm xuất kho
        var response = goodsIssueService.confirmIssue("GIN-TEST-999");

        assertNotNull(response);
        assertEquals("CONFIRMED", response.getStatus());

        // Kiểm tra trừ kho: 20 viên ban đầu - 10 viên xuất = 10 viên còn lại
        verify(inventoryRepository).save(argThat(inv -> {
            assertEquals(10, inv.getStockQuantity());
            return true;
        }));

        verify(inventoryTransactionRepository, times(1)).save(any(InventoryTransaction.class));
    }

    @Test
    void testConfirmIssue_InsufficientStock_ThrowsException() {
        GoodsIssue issue = new GoodsIssue();
        issue.setIssueId("GIN-TEST-999");
        issue.setStatus(GoodsIssue.IssueStatus.DRAFT);
        issue.setIssueType(GoodsIssue.IssueType.EXPIRED);
        issue.setEmployee(receipt.getEmployee());

        GoodsIssueDetail issueDetail = new GoodsIssueDetail();
        issueDetail.setId(1L);
        issueDetail.setIssue(issue);
        issueDetail.setInventory(inventory); // Có sẵn 20 viên
        issueDetail.setQuantity(3); // Xuất 3 hộp
        issueDetail.setConversionRate(10); // 3 hộp = 30 viên -> Vượt quá 20 viên đang có

        issue.setDetails(Collections.singletonList(issueDetail));

        when(goodsIssueRepository.findById("GIN-TEST-999")).thenReturn(Optional.of(issue));

        // Thực hiện confirm xuất kho -> Phải ném ra IllegalArgumentException do thiếu hàng
        assertThrows(IllegalArgumentException.class, () -> {
            goodsIssueService.confirmIssue("GIN-TEST-999");
        });

        verify(inventoryRepository, never()).save(any(Inventory.class));
    }

    @Test
    void testConfirmIssue_InvalidStateTransition() {
        GoodsIssue issue = new GoodsIssue();
        issue.setIssueId("GIN-TEST-999");
        issue.setStatus(GoodsIssue.IssueStatus.CANCELLED); // Đã hủy
        issue.setIssueType(GoodsIssue.IssueType.OTHER);

        when(goodsIssueRepository.findById("GIN-TEST-999")).thenReturn(Optional.of(issue));

        // Thực hiện confirm -> Phải báo lỗi
        assertThrows(IllegalStateException.class, () -> {
            goodsIssueService.confirmIssue("GIN-TEST-999");
        });
    }
}
