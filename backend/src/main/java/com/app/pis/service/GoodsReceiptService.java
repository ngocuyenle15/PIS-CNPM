package com.app.pis.service;

import com.app.pis.dto.GoodsReceiptRequest;
import com.app.pis.dto.GoodsReceiptResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.*;
import com.app.pis.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoodsReceiptService {

    private final GoodsReceiptRepository goodsReceiptRepository;
    private final GoodsReceiptDetailRepository goodsReceiptDetailRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;
    private final UnitRepository unitRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final MedicineUnitRepository medicineUnitRepository;

    @Transactional(readOnly = true)
    public PagedResponse<GoodsReceiptResponse> getAll(
            String searchType, String searchVal,
            String startDate, String endDate,
            String status,
            int page, int size) {
        
        List<GoodsReceipt> allReceipts = goodsReceiptRepository.findAll();
        List<GoodsReceipt> filtered = new ArrayList<>();

        java.time.LocalDate start = null;
        if (StringUtils.hasText(startDate)) {
            try { start = java.time.LocalDate.parse(startDate.trim()); } catch (Exception e) {}
        }
        java.time.LocalDate end = null;
        if (StringUtils.hasText(endDate)) {
            try { end = java.time.LocalDate.parse(endDate.trim()); } catch (Exception e) {}
        }

        for (GoodsReceipt gr : allReceipts) {
            boolean matchesSearch = true;
            if (StringUtils.hasText(searchType) && StringUtils.hasText(searchVal)) {
                String cleanVal = searchVal.trim().toLowerCase();
                if (searchType.equalsIgnoreCase("receiptId")) {
                    matchesSearch = gr.getReceiptId() != null && gr.getReceiptId().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("batchId")) {
                    boolean matchBatch = false;
                    if (gr.getDetails() != null) {
                        for (GoodsReceiptDetail detail : gr.getDetails()) {
                            if (detail.getBatchId() != null && detail.getBatchId().toLowerCase().contains(cleanVal)) {
                                matchBatch = true;
                                break;
                            }
                        }
                    }
                    matchesSearch = matchBatch;
                } else if (searchType.equalsIgnoreCase("supplier")) {
                    matchesSearch = gr.getSupplier() != null && gr.getSupplier().getSupplierName() != null &&
                                    gr.getSupplier().getSupplierName().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("employee")) {
                    matchesSearch = gr.getEmployee() != null && gr.getEmployee().getFullName() != null &&
                                    gr.getEmployee().getFullName().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("status")) {
                    matchesSearch = gr.getStatus() != null && gr.getStatus().name().toLowerCase().contains(cleanVal);
                }
            }

            boolean matchesDate = true;
            if (gr.getReceiptTime() != null) {
                java.time.LocalDate grDate = gr.getReceiptTime().toLocalDate();
                if (start != null && grDate.isBefore(start)) {
                    matchesDate = false;
                }
                if (end != null && grDate.isAfter(end)) {
                    matchesDate = false;
                }
            } else if (start != null || end != null) {
                matchesDate = false;
            }

            boolean matchesStatus = true;
            if (StringUtils.hasText(status)) {
                if (status.equalsIgnoreCase("UNPROCESSED")) {
                    matchesStatus = gr.getStatus() != GoodsReceipt.ReceiptStatus.CONFIRMED;
                } else if (!status.equalsIgnoreCase("ALL")) {
                    matchesStatus = gr.getStatus() != null && gr.getStatus().name().equalsIgnoreCase(status.trim());
                }
            }

            if (matchesSearch && matchesDate && matchesStatus) {
                filtered.add(gr);
            }
        }

        int totalItems = filtered.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        if (totalPages == 0) totalPages = 1;

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);
        List<GoodsReceipt> pagedList = new ArrayList<>();
        if (fromIndex < totalItems) {
            pagedList = filtered.subList(fromIndex, toIndex);
        }

        List<GoodsReceiptResponse> responses = pagedList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<GoodsReceiptResponse>builder()
                .items(responses)
                .currentPage(page)
                .totalPages(totalPages)
                .totalItems(totalItems)
                .pageSize(size)
                .build();
    }

    @Transactional(readOnly = true)
    public GoodsReceiptResponse getById(String id) {
        GoodsReceipt receipt = goodsReceiptRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu nhập kho với mã: " + id));
        return mapToResponse(receipt);
    }

    @Transactional
    public GoodsReceiptResponse createReceiptDraft(GoodsReceiptRequest request, Employee currentEmployee) {
        String receiptId = request.getReceiptId();
        GoodsReceipt receipt;
        if (!StringUtils.hasText(receiptId)) {
            receiptId = "GRN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            receipt = new GoodsReceipt();
            receipt.setReceiptId(receiptId);
            receipt.setEmployee(currentEmployee);
            receipt.setStatus(GoodsReceipt.ReceiptStatus.DRAFT);
        } else {
            receiptId = receiptId.trim().toUpperCase();
            receipt = goodsReceiptRepository.findById(receiptId).orElse(null);
            if (receipt == null) {
                receipt = new GoodsReceipt();
                receipt.setReceiptId(receiptId);
                receipt.setEmployee(currentEmployee);
                receipt.setStatus(GoodsReceipt.ReceiptStatus.DRAFT);
            } else {
                if (receipt.getStatus() != GoodsReceipt.ReceiptStatus.DRAFT) {
                    throw new IllegalStateException("Không thể chỉnh sửa phiếu nhập đã xác nhận hoặc đã hủy.");
                }
                receipt.getDetails().clear();
            }
        }

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà cung cấp với mã: " + request.getSupplierId()));

        receipt.setSupplier(supplier);
        receipt.setNote(request.getNote());

        List<GoodsReceiptDetail> details = new ArrayList<>();
        if (request.getDetails() != null) {
            for (GoodsReceiptRequest.DetailRequest reqDetail : request.getDetails()) {
                Medicine medicine = medicineRepository.findById(reqDetail.getMedicineId())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thuốc với mã: " + reqDetail.getMedicineId()));

                Unit txUnit = null;
                if (StringUtils.hasText(reqDetail.getTransactionUnitId())) {
                    txUnit = unitRepository.findById(reqDetail.getTransactionUnitId())
                            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị tính với mã: " + reqDetail.getTransactionUnitId()));
                }

                GoodsReceiptDetail detail = new GoodsReceiptDetail();
                detail.setReceipt(receipt);
                detail.setMedicine(medicine);
                detail.setBatchId(reqDetail.getBatchId());
                detail.setQuantity(reqDetail.getQuantity());
                detail.setImportPrice(reqDetail.getImportPrice());
                detail.setExpiryDate(reqDetail.getExpiryDate());
                detail.setManufacturedDate(reqDetail.getManufacturedDate());
                detail.setTransactionUnit(txUnit);

                // Auto-resolve conversion rate based on transaction unit
                int resolvedRate = 1;
                if (txUnit != null) {
                    if (txUnit.getUnitID().equals(medicine.getBaseUnit().getUnitID())) {
                        resolvedRate = 1;
                    } else {
                        final Unit finalTxUnit = txUnit;
                        final Medicine finalMedicine = medicine;
                        resolvedRate = medicineUnitRepository.findByMedicineAndUnit(finalMedicine, finalTxUnit)
                                .map(MedicineUnit::getConversionRate)
                                .orElseThrow(() -> new IllegalArgumentException(
                                        String.format("Đơn vị tính '%s' không hợp lệ hoặc chưa được cấu hình cho thuốc '%s'.", 
                                                finalTxUnit.getUnitName(), finalMedicine.getMedicineName())
                                ));
                    }
                }
                detail.setConversionRate(resolvedRate);

                details.add(detail);
            }
        }

        receipt.setDetails(details);
        GoodsReceipt saved = goodsReceiptRepository.save(receipt);
        return mapToResponse(saved);
    }

    @Transactional
    public GoodsReceiptResponse confirmReceipt(String receiptId) {
        GoodsReceipt receipt = goodsReceiptRepository.findById(receiptId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu nhập kho với mã: " + receiptId));

        // RÀNG BUỘC CHUYỂN TRẠNG THÁI: Chỉ cho phép chuyển sang CONFIRMED từ DRAFT
        if (receipt.getStatus() != GoodsReceipt.ReceiptStatus.DRAFT) {
            throw new IllegalStateException("Chỉ có thể xác nhận phiếu nhập ở trạng thái NHÁP (DRAFT). Trạng thái hiện tại: " + receipt.getStatus());
        }

        for (GoodsReceiptDetail detail : receipt.getDetails()) {
            Medicine medicine = detail.getMedicine();
            
            // Xử lý quy đổi đơn vị tính tự động
            int conversionRate = detail.getConversionRate() != null ? detail.getConversionRate() : 1;
            int baseQuantity = detail.getQuantity() * conversionRate;

            // Xác định ID lô tồn kho: medicineID + "-" + batchId
            String inventoryId = medicine.getMedicineID() + "-" + detail.getBatchId().trim().toUpperCase();
            
            Inventory inventory = inventoryRepository.findById(inventoryId).orElse(null);
            if (inventory == null) {
                // Tạo lô mới
                inventory = new Inventory();
                inventory.setId(inventoryId);
                inventory.setBatchId(detail.getBatchId().trim().toUpperCase());
                inventory.setMedicine(medicine);
                inventory.setImportPrice(detail.getImportPrice());
                inventory.setExpiryDate(detail.getExpiryDate());
                inventory.setManufacturedDate(detail.getManufacturedDate());
                inventory.setStockQuantity(baseQuantity);
                inventory.setStatus(Inventory.InventoryStatus.ACTIVE);
            } else {
                // Cộng dồn tồn kho
                inventory.setStockQuantity(inventory.getStockQuantity() + baseQuantity);
                // Cập nhật giá nhập mới nhất (hoặc giữ nguyên tùy nghiệp vụ, ở đây cập nhật theo phiếu mới nhất)
                inventory.setImportPrice(detail.getImportPrice());
                inventory.setExpiryDate(detail.getExpiryDate());
                inventory.setManufacturedDate(detail.getManufacturedDate());
                inventory.setStatus(Inventory.InventoryStatus.ACTIVE);
            }



            Inventory savedInv = inventoryRepository.save(inventory);

            // Ghi nhật ký thẻ kho (InventoryTransaction)
            InventoryTransaction transaction = InventoryTransaction.builder()
                    .transactionTime(LocalDateTime.now())
                    .type(InventoryTransaction.TransactionType.IMPORT)
                    .referenceId(receipt.getReceiptId())
                    .inventory(savedInv)
                    .quantityChanged(baseQuantity)
                    .endingBalance(savedInv.getStockQuantity())
                    .build();
            
            inventoryTransactionRepository.save(transaction);
        }

        receipt.setStatus(GoodsReceipt.ReceiptStatus.CONFIRMED);
        GoodsReceipt saved = goodsReceiptRepository.save(receipt);
        return mapToResponse(saved);
    }

    @Transactional
    public GoodsReceiptResponse cancelReceipt(String receiptId) {
        GoodsReceipt receipt = goodsReceiptRepository.findById(receiptId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu nhập kho với mã: " + receiptId));

        // RÀNG BUỘC CHUYỂN TRẠNG THÁI: Chỉ cho phép chuyển sang CANCELLED từ DRAFT
        if (receipt.getStatus() != GoodsReceipt.ReceiptStatus.DRAFT) {
            throw new IllegalStateException("Chỉ có thể hủy phiếu nhập ở trạng thái NHÁP (DRAFT). Trạng thái hiện tại: " + receipt.getStatus());
        }

        receipt.setStatus(GoodsReceipt.ReceiptStatus.CANCELLED);
        GoodsReceipt saved = goodsReceiptRepository.save(receipt);
        return mapToResponse(saved);
    }

    private GoodsReceiptResponse mapToResponse(GoodsReceipt receipt) {
        List<GoodsReceiptResponse.DetailResponse> details = receipt.getDetails().stream().map(d -> 
                GoodsReceiptResponse.DetailResponse.builder()
                        .id(d.getId())
                        .medicineId(d.getMedicine().getMedicineID())
                        .medicineName(d.getMedicine().getMedicineName())
                        .batchId(d.getBatchId())
                        .quantity(d.getQuantity())
                        .importPrice(d.getImportPrice())
                        .expiryDate(d.getExpiryDate())
                        .manufacturedDate(d.getManufacturedDate())
                        .transactionUnitName(d.getTransactionUnit() != null ? d.getTransactionUnit().getUnitName() : d.getMedicine().getBaseUnit().getUnitName())
                        .conversionRate(d.getConversionRate())
                        .build()

        ).collect(Collectors.toList());

        return GoodsReceiptResponse.builder()
                .receiptId(receipt.getReceiptId())
                .receiptTime(receipt.getReceiptTime())
                .employeeName(receipt.getEmployee().getFullName())
                .supplierName(receipt.getSupplier().getSupplierName())
                .note(receipt.getNote())
                .status(receipt.getStatus().name())
                .details(details)
                .build();
    }
}
