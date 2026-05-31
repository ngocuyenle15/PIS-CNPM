package com.app.pis.service;

import com.app.pis.dto.InvoiceRequest;
import com.app.pis.dto.InvoiceResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.*;
import com.app.pis.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    @Transactional(readOnly = true)
    public PagedResponse<InvoiceResponse> getAll(String search, int page, int size) {
        List<Invoice> allInvoices = invoiceRepository.findAll(Sort.by("invoiceTime").descending());
        List<Invoice> filtered = new java.util.ArrayList<>();

        for (Invoice invoice : allInvoices) {
            boolean matches = true;
            if (org.springframework.util.StringUtils.hasText(search)) {
                String cleanVal = search.trim().toLowerCase();
                boolean matchDetails = false;
                if (invoice.getInvoiceDetails() != null) {
                    for (InvoiceDetail d : invoice.getInvoiceDetails()) {
                        if ((d.getInventory() != null && d.getInventory().getMedicine() != null &&
                             d.getInventory().getMedicine().getMedicineName().toLowerCase().contains(cleanVal)) ||
                            (d.getInventory() != null && d.getInventory().getBatchId() != null &&
                             d.getInventory().getBatchId().toLowerCase().contains(cleanVal))) {
                            matchDetails = true;
                            break;
                        }
                    }
                }
                
                String customerName = invoice.getCustomer() != null ? invoice.getCustomer().getFullName().toLowerCase() : "khách lẻ vãng lai";
                String paymentMethod = invoice.getPaymentMethod() != null ? invoice.getPaymentMethod().name().toLowerCase() : "";
                String displayMethod = paymentMethod.equals("cash") ? "tiền mặt" : (paymentMethod.equals("card") ? "thẻ ngân hàng" : "");
                String invoiceIdStr = String.valueOf(invoice.getInvoiceID());

                matches = invoiceIdStr.contains(cleanVal) || 
                          customerName.contains(cleanVal) || 
                          paymentMethod.contains(cleanVal) ||
                          displayMethod.contains(cleanVal) ||
                          matchDetails;
            }

            if (matches) {
                filtered.add(invoice);
            }
        }

        int totalItems = filtered.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        if (totalPages == 0) totalPages = 1;

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);

        List<InvoiceResponse> responses = new java.util.ArrayList<>();
        if (fromIndex < totalItems) {
            responses = filtered.subList(fromIndex, toIndex).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        return PagedResponse.<InvoiceResponse>builder()
                .items(responses)
                .currentPage(page)
                .totalPages(totalPages)
                .totalItems(totalItems)
                .pageSize(size)
                .build();
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getById(Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hóa đơn với mã: " + id));
        return mapToResponse(invoice);
    }

    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Customer customer = null;
        if (StringUtils.hasText(request.getCustomerId())) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với mã: " + request.getCustomerId()));
        }

        Invoice invoice = new Invoice();
        invoice.setCustomer(customer);
        invoice.setAddress(StringUtils.hasText(request.getAddress()) ? request.getAddress() : "Tại quầy");
        
        Invoice.PaymentMethod paymentMethod = Invoice.PaymentMethod.Cash;
        if (StringUtils.hasText(request.getPaymentMethod()) && request.getPaymentMethod().equalsIgnoreCase("Card")) {
            paymentMethod = Invoice.PaymentMethod.Card;
        }
        invoice.setPaymentMethod(paymentMethod);
        invoice.setStatus(Invoice.InvoiceStatus.Paid);

        List<InvoiceDetail> details = new ArrayList<>();
        if (request.getDetails() != null) {
            for (InvoiceRequest.DetailRequest reqDetail : request.getDetails()) {
                Inventory inventory = inventoryRepository.findById(reqDetail.getInventoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lô thuốc trong kho: " + reqDetail.getInventoryId()));

                int rate = reqDetail.getConversionRate() != null ? reqDetail.getConversionRate() : 1;
                int baseQuantity = reqDetail.getQuantity() * rate;

                // KIỂM TRA ĐỦ TỒN KHO LÔ
                if (inventory.getStockQuantity() < baseQuantity) {
                    throw new IllegalArgumentException(String.format("Không đủ tồn kho! Hoạt chất: %s, Lô: %s, Yêu cầu: %d viên, Tồn thực tế: %d viên",
                            inventory.getMedicine().getMedicineName(),
                            inventory.getBatchId(),
                            baseQuantity,
                            inventory.getStockQuantity()));
                }

                // Trừ tồn kho lô trực tiếp
                int newQuantity = inventory.getStockQuantity() - baseQuantity;
                inventory.setStockQuantity(newQuantity);
                if (newQuantity == 0) {
                    inventory.setStatus(Inventory.InventoryStatus.SOLD_OUT);
                }
                Inventory savedInv = inventoryRepository.save(inventory);


                InvoiceDetail detail = new InvoiceDetail();
                detail.setInvoice(invoice);
                detail.setInventory(savedInv);
                detail.setQuantity(reqDetail.getQuantity());
                detail.setUnitPrice(reqDetail.getUnitPrice());
                detail.setNote(reqDetail.getNote());

                details.add(detail);


                // Ghi nhật ký thẻ kho loại SALE
                InventoryTransaction transaction = InventoryTransaction.builder()
                        .transactionTime(LocalDateTime.now())
                        .type(InventoryTransaction.TransactionType.SALE)
                        .referenceId("INV-" + String.format("%06d", System.currentTimeMillis() % 1000000)) // Tạo số tham chiếu hóa đơn giả định nếu chưa lưu
                        .inventory(savedInv)
                        .quantityChanged(-baseQuantity) // Trừ kho ghi âm
                        .endingBalance(savedInv.getStockQuantity())
                        .build();

                inventoryTransactionRepository.save(transaction);
            }
        }

        invoice.setInvoiceDetails(details);
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        // Cập nhật lại referenceId của các giao dịch kho cho chính xác mã hóa đơn thực
        for (InvoiceDetail d : savedInvoice.getInvoiceDetails()) {
            List<InventoryTransaction> txs = inventoryTransactionRepository.findByInventoryIdOrderByTransactionTimeAsc(d.getInventory().getId());
            if (!txs.isEmpty()) {
                InventoryTransaction lastTx = txs.get(txs.size() - 1);
                if (lastTx.getType() == InventoryTransaction.TransactionType.SALE && lastTx.getReferenceId().startsWith("INV-")) {
                    lastTx.setReferenceId("INV-" + savedInvoice.getInvoiceID());
                    inventoryTransactionRepository.save(lastTx);
                }
            }
        }

        return mapToResponse(savedInvoice);
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        List<InvoiceResponse.DetailResponse> details = invoice.getInvoiceDetails().stream().map(d -> 
                InvoiceResponse.DetailResponse.builder()
                        .id(d.getId())
                        .inventoryId(d.getInventory().getId())
                        .medicineName(d.getInventory().getMedicine().getMedicineName())
                        .batchId(d.getInventory().getBatchId())
                        .quantity(d.getQuantity())
                        .unitPrice(d.getUnitPrice())
                        .subTotal(d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                        .note(d.getNote())
                        .build()

        ).collect(Collectors.toList());

        return InvoiceResponse.builder()
                .invoiceID(invoice.getInvoiceID())
                .invoiceTime(invoice.getInvoiceTime())
                .customerName(invoice.getCustomer() != null ? invoice.getCustomer().getFullName() : "Khách lẻ vãng lai")
                .address(invoice.getAddress())
                .paymentMethod(invoice.getPaymentMethod().name())
                .status(invoice.getStatus().name())
                .details(details)
                .build();
    }
}
