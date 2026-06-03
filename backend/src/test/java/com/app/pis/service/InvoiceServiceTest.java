package com.app.pis.service;

import com.app.pis.dto.InvoiceRequest;
import com.app.pis.dto.InvoiceResponse;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private InventoryTransactionRepository inventoryTransactionRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    private Customer customer;
    private Inventory inventory;
    private Medicine medicine;

    @BeforeEach
    void setUp() {
        Unit baseUnit = new Unit();
        baseUnit.setUnitID("UNIT001");
        baseUnit.setUnitName("Viên");

        Catalog catalog = new Catalog();
        catalog.setCatalogID("CAT001");
        catalog.setCatalogName("Thuốc kháng sinh");

        Origin origin = new Origin();
        origin.setOriginID("ORG001");
        origin.setOriginName("Việt Nam");

        medicine = new Medicine();
        medicine.setMedicineID("MED001");
        medicine.setMedicineName("Paracetamol 500mg");
        medicine.setBaseUnit(baseUnit);
        medicine.setCatalog(catalog);
        medicine.setOrigin(origin);
        medicine.setUnitPrice(new BigDecimal("1500.00"));

        customer = new Customer();
        customer.setCustomerID("CUST001");
        customer.setFullName("Nguyễn Văn A");
        customer.setPhoneNumber("0912345678");
        customer.setGender(Customer.Gender.Male);

        inventory = new Inventory();
        inventory.setId("MED001-BATCH001");
        inventory.setBatchId("BATCH001");
        inventory.setMedicine(medicine);
        inventory.setImportPrice(new BigDecimal("1000.00"));
        inventory.setStockQuantity(100);
        inventory.setExpiryDate(LocalDate.now().plusYears(1));
        inventory.setStatus(Inventory.InventoryStatus.ACTIVE);
    }

    // =========================================================================
    // TESTS FOR CREATE INVOICE (POS)
    // =========================================================================

    @Test
    void testCreateInvoice_Success_WithCustomer() {
        InvoiceRequest.DetailRequest detail = new InvoiceRequest.DetailRequest();
        detail.setInventoryId("MED001-BATCH001");
        detail.setQuantity(5);
        detail.setUnitPrice(new BigDecimal("1500.00"));
        detail.setConversionRate(1);
        detail.setNote("Bán 5 viên");

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId("CUST001");
        request.setAddress("123 Đường ABC");
        request.setPaymentMethod("Cash");
        request.setDetails(List.of(detail));

        when(customerRepository.findById("CUST001")).thenReturn(Optional.of(customer));
        when(inventoryRepository.findById("MED001-BATCH001")).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(inv -> inv.getArgument(0));
        when(inventoryTransactionRepository.save(any(InventoryTransaction.class))).thenAnswer(inv -> inv.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice invoice = inv.getArgument(0);
            invoice.setInvoiceID(1);
            return invoice;
        });
        when(inventoryTransactionRepository.findByInventoryIdOrderByTransactionTimeAsc(anyString()))
                .thenReturn(Collections.emptyList());

        InvoiceResponse response = invoiceService.createInvoice(request);

        assertNotNull(response);
        assertEquals("Nguyễn Văn A", response.getCustomerName());
        assertEquals("Cash", response.getPaymentMethod());
        // Kiểm tra tồn kho đã bị trừ: 100 - 5 = 95
        assertEquals(95, inventory.getStockQuantity());
    }

    @Test
    void testCreateInvoice_Success_WalkInCustomer() {
        InvoiceRequest.DetailRequest detail = new InvoiceRequest.DetailRequest();
        detail.setInventoryId("MED001-BATCH001");
        detail.setQuantity(2);
        detail.setUnitPrice(new BigDecimal("1500.00"));
        detail.setConversionRate(1);

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId(""); // Khách lẻ vãng lai
        request.setAddress("Tại quầy");
        request.setPaymentMethod("Cash");
        request.setDetails(List.of(detail));

        when(inventoryRepository.findById("MED001-BATCH001")).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(inv -> inv.getArgument(0));
        when(inventoryTransactionRepository.save(any(InventoryTransaction.class))).thenAnswer(inv -> inv.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice invoice = inv.getArgument(0);
            invoice.setInvoiceID(2);
            return invoice;
        });
        when(inventoryTransactionRepository.findByInventoryIdOrderByTransactionTimeAsc(anyString()))
                .thenReturn(Collections.emptyList());

        InvoiceResponse response = invoiceService.createInvoice(request);

        assertNotNull(response);
        assertEquals("Khách lẻ vãng lai", response.getCustomerName());
        assertEquals(98, inventory.getStockQuantity()); // 100 - 2
    }

    @Test
    void testCreateInvoice_InsufficientStock_ThrowsException() {
        // Yêu cầu 150 viên nhưng kho chỉ có 100
        InvoiceRequest.DetailRequest detail = new InvoiceRequest.DetailRequest();
        detail.setInventoryId("MED001-BATCH001");
        detail.setQuantity(150);
        detail.setUnitPrice(new BigDecimal("1500.00"));
        detail.setConversionRate(1);

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId("");
        request.setAddress("Tại quầy");
        request.setPaymentMethod("Cash");
        request.setDetails(List.of(detail));

        when(inventoryRepository.findById("MED001-BATCH001")).thenReturn(Optional.of(inventory));

        assertThrows(IllegalArgumentException.class, () -> {
            invoiceService.createInvoice(request);
        });

        // Kiểm tra tồn kho không bị thay đổi
        assertEquals(100, inventory.getStockQuantity());
        verify(invoiceRepository, never()).save(any());
    }

    @Test
    void testCreateInvoice_WithConversionRate_DeductsCorrectly() {
        // Bán 3 hộp, 1 hộp = 10 viên → trừ 30 viên
        InvoiceRequest.DetailRequest detail = new InvoiceRequest.DetailRequest();
        detail.setInventoryId("MED001-BATCH001");
        detail.setQuantity(3);
        detail.setUnitPrice(new BigDecimal("15000.00"));
        detail.setConversionRate(10); // 1 hộp = 10 viên

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId("");
        request.setAddress("Tại quầy");
        request.setPaymentMethod("Card");
        request.setDetails(List.of(detail));

        when(inventoryRepository.findById("MED001-BATCH001")).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(inv -> inv.getArgument(0));
        when(inventoryTransactionRepository.save(any(InventoryTransaction.class))).thenAnswer(inv -> inv.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice invoice = inv.getArgument(0);
            invoice.setInvoiceID(3);
            return invoice;
        });
        when(inventoryTransactionRepository.findByInventoryIdOrderByTransactionTimeAsc(anyString()))
                .thenReturn(Collections.emptyList());

        InvoiceResponse response = invoiceService.createInvoice(request);

        assertNotNull(response);
        // 100 viên - (3 hộp × 10 viên/hộp) = 70 viên
        assertEquals(70, inventory.getStockQuantity());
    }

    @Test
    void testCreateInvoice_SoldOut_UpdatesStatus() {
        inventory.setStockQuantity(10); // Chỉ còn 10 viên

        InvoiceRequest.DetailRequest detail = new InvoiceRequest.DetailRequest();
        detail.setInventoryId("MED001-BATCH001");
        detail.setQuantity(10); // Mua hết 10 viên
        detail.setUnitPrice(new BigDecimal("1500.00"));
        detail.setConversionRate(1);

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId("");
        request.setAddress("Tại quầy");
        request.setPaymentMethod("Cash");
        request.setDetails(List.of(detail));

        when(inventoryRepository.findById("MED001-BATCH001")).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(inv -> inv.getArgument(0));
        when(inventoryTransactionRepository.save(any(InventoryTransaction.class))).thenAnswer(inv -> inv.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice invoice = inv.getArgument(0);
            invoice.setInvoiceID(4);
            return invoice;
        });
        when(inventoryTransactionRepository.findByInventoryIdOrderByTransactionTimeAsc(anyString()))
                .thenReturn(Collections.emptyList());

        invoiceService.createInvoice(request);

        // Kiểm tra tồn kho = 0 và status = SOLD_OUT
        assertEquals(0, inventory.getStockQuantity());
        assertEquals(Inventory.InventoryStatus.SOLD_OUT, inventory.getStatus());
    }

    @Test
    void testCreateInvoice_InventoryNotFound_ThrowsException() {
        InvoiceRequest.DetailRequest detail = new InvoiceRequest.DetailRequest();
        detail.setInventoryId("NONEXISTENT-BATCH");
        detail.setQuantity(1);
        detail.setUnitPrice(new BigDecimal("1000.00"));
        detail.setConversionRate(1);

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId("");
        request.setPaymentMethod("Cash");
        request.setDetails(List.of(detail));

        when(inventoryRepository.findById("NONEXISTENT-BATCH")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            invoiceService.createInvoice(request);
        });
    }

    // =========================================================================
    // TESTS FOR GET BY ID
    // =========================================================================

    @Test
    void testGetById_NotFound_ThrowsException() {
        when(invoiceRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            invoiceService.getById(999);
        });
    }
}
