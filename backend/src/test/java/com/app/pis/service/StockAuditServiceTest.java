package com.app.pis.service;

import com.app.pis.dto.StockAuditRequest;
import com.app.pis.dto.StockAuditResponse;
import com.app.pis.entity.*;
import com.app.pis.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StockAuditServiceTest {

    @Mock
    private StockAuditRepository stockAuditRepository;

    @Mock
    private StockAuditDetailRepository stockAuditDetailRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private InventoryTransactionRepository inventoryTransactionRepository;

    @InjectMocks
    private StockAuditService stockAuditService;

    private Employee employee;
    private Inventory inventory;
    private StockAudit audit;
    private StockAuditDetail auditDetail;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setEmployeeID("EMP-TEST");
        employee.setFullName("Kiểm kho viên");

        Unit unit = new Unit("U1", "Viên");
        Medicine medicine = new Medicine();
        medicine.setMedicineID("MED1");
        medicine.setMedicineName("Paracetamol");
        medicine.setBaseUnit(unit);

        inventory = new Inventory();
        inventory.setId("INV1");
        inventory.setBatchId("BATCH1");
        inventory.setMedicine(medicine);
        inventory.setStockQuantity(50);
        inventory.setStatus(Inventory.InventoryStatus.ACTIVE);

        audit = new StockAudit();
        audit.setAuditId("AUD-TEST-01");
        audit.setStatus(StockAudit.AuditStatus.DRAFT);
        audit.setCreatedBy(employee);

        auditDetail = new StockAuditDetail();
        auditDetail.setId(1L);
        auditDetail.setAudit(audit);
        auditDetail.setInventory(inventory);
        auditDetail.setSystemQuantity(50);
        auditDetail.setActualQuantity(50);
        auditDetail.setDiscrepancy(0);

        audit.setDetails(new ArrayList<>(Collections.singletonList(auditDetail)));
    }

    @Test
    void testCreateAuditDraft_Success() {
        StockAuditRequest request = new StockAuditRequest();
        request.setNote("Kiểm kho tháng 6");

        when(inventoryRepository.findAll()).thenReturn(Collections.singletonList(inventory));
        when(stockAuditRepository.save(any(StockAudit.class))).thenAnswer(inv -> inv.getArgument(0));

        StockAuditResponse response = stockAuditService.createAuditDraft(request, employee);

        assertNotNull(response);
        assertEquals("Kiểm kho tháng 6", response.getNote());
        assertEquals("DRAFT", response.getStatus());
        assertEquals(1, response.getDetails().size());
        verify(stockAuditRepository).save(any(StockAudit.class));
    }

    @Test
    void testStartAuditCount_Success() {
        when(stockAuditRepository.findById("AUD-TEST-01")).thenReturn(Optional.of(audit));
        when(stockAuditRepository.save(any(StockAudit.class))).thenAnswer(inv -> inv.getArgument(0));

        StockAuditResponse response = stockAuditService.startAuditCount("AUD-TEST-01");

        assertNotNull(response);
        assertEquals("IN_PROGRESS", response.getStatus());
        verify(stockAuditRepository).save(audit);
    }

    @Test
    void testStartAuditCount_InvalidState_ThrowsException() {
        audit.setStatus(StockAudit.AuditStatus.CONFIRMED); // Đã chốt
        when(stockAuditRepository.findById("AUD-TEST-01")).thenReturn(Optional.of(audit));

        assertThrows(IllegalStateException.class, () -> {
            stockAuditService.startAuditCount("AUD-TEST-01");
        });
    }

    @Test
    void testSaveAuditDraftQuantity_Success() {
        StockAuditRequest.DetailRequest detailReq = new StockAuditRequest.DetailRequest();
        detailReq.setInventoryId("INV1");
        detailReq.setActualQuantity(48); // Thực tế chỉ có 48 viên -> lệch -2
        detailReq.setNote("Mất mát");

        StockAuditRequest request = new StockAuditRequest();
        request.setDetails(Collections.singletonList(detailReq));

        when(stockAuditRepository.findById("AUD-TEST-01")).thenReturn(Optional.of(audit));
        when(stockAuditRepository.save(any(StockAudit.class))).thenAnswer(inv -> inv.getArgument(0));

        StockAuditResponse response = stockAuditService.saveAuditDraftQuantity("AUD-TEST-01", request);

        assertNotNull(response);
        assertEquals("IN_PROGRESS", response.getStatus());
        assertEquals(48, auditDetail.getActualQuantity());
        assertEquals(-2, auditDetail.getDiscrepancy());
    }

    @Test
    void testConfirmAudit_Success_WithDiscrepancy() {
        audit.setStatus(StockAudit.AuditStatus.IN_PROGRESS);
        auditDetail.setActualQuantity(48);
        auditDetail.setDiscrepancy(-2); // Hao hụt 2 viên

        when(stockAuditRepository.findById("AUD-TEST-01")).thenReturn(Optional.of(audit));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(inv -> inv.getArgument(0));
        when(inventoryTransactionRepository.save(any(InventoryTransaction.class))).thenAnswer(inv -> inv.getArgument(0));
        when(stockAuditRepository.save(any(StockAudit.class))).thenAnswer(inv -> inv.getArgument(0));

        StockAuditResponse response = stockAuditService.confirmAudit("AUD-TEST-01", employee);

        assertNotNull(response);
        assertEquals("CONFIRMED", response.getStatus());
        assertEquals(48, inventory.getStockQuantity());
        verify(inventoryTransactionRepository).save(any(InventoryTransaction.class));
        verify(stockAuditRepository).save(audit);
    }

    @Test
    void testConfirmAudit_MissingActualQuantity_ThrowsException() {
        auditDetail.setActualQuantity(null); // Chưa đếm thực tế
        when(stockAuditRepository.findById("AUD-TEST-01")).thenReturn(Optional.of(audit));

        assertThrows(IllegalArgumentException.class, () -> {
            stockAuditService.confirmAudit("AUD-TEST-01", employee);
        });
    }

    @Test
    void testCancelAudit_Success() {
        when(stockAuditRepository.findById("AUD-TEST-01")).thenReturn(Optional.of(audit));
        when(stockAuditRepository.save(any(StockAudit.class))).thenAnswer(inv -> inv.getArgument(0));

        StockAuditResponse response = stockAuditService.cancelAudit("AUD-TEST-01");

        assertNotNull(response);
        assertEquals("CANCELLED", response.getStatus());
        verify(stockAuditRepository).save(audit);
    }
}
