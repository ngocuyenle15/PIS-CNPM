package com.app.pis.service;

import com.app.pis.dto.GoodsIssueRequest;
import com.app.pis.dto.GoodsIssueResponse;
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
public class GoodsIssueService {

    private final GoodsIssueRepository goodsIssueRepository;
    private final GoodsIssueDetailRepository goodsIssueDetailRepository;
    private final InventoryRepository inventoryRepository;
    private final UnitRepository unitRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final MedicineUnitRepository medicineUnitRepository;

    @Transactional(readOnly = true)
    public PagedResponse<GoodsIssueResponse> getAll(
            String searchType, String searchVal,
            String startDate, String endDate,
            String status,
            int page, int size) {
        
        List<GoodsIssue> allIssues = goodsIssueRepository.findAll();
        List<GoodsIssue> filtered = new ArrayList<>();

        java.time.LocalDate start = null;
        if (StringUtils.hasText(startDate)) {
            try { start = java.time.LocalDate.parse(startDate.trim()); } catch (Exception e) {}
        }
        java.time.LocalDate end = null;
        if (StringUtils.hasText(endDate)) {
            try { end = java.time.LocalDate.parse(endDate.trim()); } catch (Exception e) {}
        }

        for (GoodsIssue gi : allIssues) {
            boolean matchesSearch = true;
            if (StringUtils.hasText(searchType) && StringUtils.hasText(searchVal)) {
                String cleanVal = searchVal.trim().toLowerCase();
                if (searchType.equalsIgnoreCase("issueId")) {
                    matchesSearch = gi.getIssueId() != null && gi.getIssueId().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("batchId")) {
                    boolean matchBatch = false;
                    if (gi.getDetails() != null) {
                        for (GoodsIssueDetail detail : gi.getDetails()) {
                            if (detail.getInventory() != null && detail.getInventory().getBatchId() != null &&
                                detail.getInventory().getBatchId().toLowerCase().contains(cleanVal)) {
                                matchBatch = true;
                                break;
                            }
                        }
                    }
                    matchesSearch = matchBatch;
                } else if (searchType.equalsIgnoreCase("issueType")) {
                    matchesSearch = gi.getIssueType() != null && gi.getIssueType().name().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("employee")) {
                    matchesSearch = gi.getEmployee() != null && gi.getEmployee().getFullName() != null &&
                                    gi.getEmployee().getFullName().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("status")) {
                    matchesSearch = gi.getStatus() != null && gi.getStatus().name().toLowerCase().contains(cleanVal);
                }
            }

            boolean matchesDate = true;
            if (gi.getIssueTime() != null) {
                java.time.LocalDate giDate = gi.getIssueTime().toLocalDate();
                if (start != null && giDate.isBefore(start)) {
                    matchesDate = false;
                }
                if (end != null && giDate.isAfter(end)) {
                    matchesDate = false;
                }
            } else if (start != null || end != null) {
                matchesDate = false;
            }

            boolean matchesStatus = true;
            if (StringUtils.hasText(status)) {
                if (status.equalsIgnoreCase("UNPROCESSED")) {
                    matchesStatus = gi.getStatus() != GoodsIssue.IssueStatus.CONFIRMED;
                } else if (!status.equalsIgnoreCase("ALL")) {
                    matchesStatus = gi.getStatus() != null && gi.getStatus().name().equalsIgnoreCase(status.trim());
                }
            }

            if (matchesSearch && matchesDate && matchesStatus) {
                filtered.add(gi);
            }
        }

        int totalItems = filtered.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        if (totalPages == 0) totalPages = 1;

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);
        List<GoodsIssue> pagedList = new ArrayList<>();
        if (fromIndex < totalItems) {
            pagedList = filtered.subList(fromIndex, toIndex);
        }

        List<GoodsIssueResponse> responses = pagedList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<GoodsIssueResponse>builder()
                .items(responses)
                .currentPage(page)
                .totalPages(totalPages)
                .totalItems(totalItems)
                .pageSize(size)
                .build();
    }

    @Transactional(readOnly = true)
    public GoodsIssueResponse getById(String id) {
        GoodsIssue issue = goodsIssueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu xuất kho với mã: " + id));
        return mapToResponse(issue);
    }

    @Transactional
    public GoodsIssueResponse createIssueDraft(GoodsIssueRequest request, Employee currentEmployee) {
        String issueId = request.getIssueId();
        GoodsIssue issue;
        if (!StringUtils.hasText(issueId)) {
            issueId = "GIN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            issue = new GoodsIssue();
            issue.setIssueId(issueId);
            issue.setEmployee(currentEmployee);
            issue.setStatus(GoodsIssue.IssueStatus.DRAFT);
        } else {
            issueId = issueId.trim().toUpperCase();
            issue = goodsIssueRepository.findById(issueId).orElse(null);
            if (issue == null) {
                issue = new GoodsIssue();
                issue.setIssueId(issueId);
                issue.setEmployee(currentEmployee);
                issue.setStatus(GoodsIssue.IssueStatus.DRAFT);
            } else {
                if (issue.getStatus() != GoodsIssue.IssueStatus.DRAFT) {
                    throw new IllegalStateException("Không thể chỉnh sửa phiếu xuất đã xác nhận hoặc đã hủy.");
                }
                issue.getDetails().clear();
            }
        }

        GoodsIssue.IssueType type;
        try {
            type = GoodsIssue.IssueType.valueOf(request.getIssueType().trim().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Loại xuất kho không hợp lệ: " + request.getIssueType());
        }

        issue.setIssueType(type);
        issue.setNote(request.getNote());

        List<GoodsIssueDetail> details = new ArrayList<>();
        if (request.getDetails() != null) {
            for (GoodsIssueRequest.DetailRequest reqDetail : request.getDetails()) {
                Inventory inventory = inventoryRepository.findById(reqDetail.getInventoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lô thuốc tồn kho với mã: " + reqDetail.getInventoryId()));

                Unit txUnit = null;
                if (StringUtils.hasText(reqDetail.getTransactionUnitId())) {
                    txUnit = unitRepository.findById(reqDetail.getTransactionUnitId())
                            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị tính với mã: " + reqDetail.getTransactionUnitId()));
                }

                GoodsIssueDetail detail = new GoodsIssueDetail();
                detail.setIssue(issue);
                detail.setInventory(inventory);
                detail.setQuantity(reqDetail.getQuantity());
                detail.setTransactionUnit(txUnit);

                // Auto-resolve conversion rate based on transaction unit and medicine
                int resolvedRate = 1;
                if (txUnit != null && inventory.getMedicine() != null) {
                    Medicine medicine = inventory.getMedicine();
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

        issue.setDetails(details);
        GoodsIssue saved = goodsIssueRepository.save(issue);
        return mapToResponse(saved);
    }

    @Transactional
    public GoodsIssueResponse confirmIssue(String issueId) {
        GoodsIssue issue = goodsIssueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu xuất kho với mã: " + issueId));

        // RÀNG BUỘC CHUYỂN TRẠNG THÁI: Chỉ cho phép chuyển sang CONFIRMED từ DRAFT
        if (issue.getStatus() != GoodsIssue.IssueStatus.DRAFT) {
            throw new IllegalStateException("Chỉ có thể xác nhận phiếu xuất ở trạng thái NHÁP (DRAFT). Trạng thái hiện tại: " + issue.getStatus());
        }

        for (GoodsIssueDetail detail : issue.getDetails()) {
            Inventory inventory = detail.getInventory();
            
            // Tự động quy đổi đơn vị tính
            int conversionRate = detail.getConversionRate() != null ? detail.getConversionRate() : 1;
            int baseQuantity = detail.getQuantity() * conversionRate;

            // KIỂM TRA ĐỦ TỒN KHO: Nếu số lượng xuất vượt quá tồn kho thực tế -> Báo lỗi & Rollback
            if (inventory.getStockQuantity() < baseQuantity) {
                throw new IllegalArgumentException(String.format("Không đủ tồn kho để xuất! Thuốc: %s, Lô: %s, Yêu cầu xuất: %d, Tồn kho hiện tại: %d (quy về đơn vị gốc)",
                        inventory.getMedicine().getMedicineName(),
                        inventory.getBatchId(),
                        baseQuantity,
                        inventory.getStockQuantity()));
            }

            // Trừ tồn kho
            int newQuantity = inventory.getStockQuantity() - baseQuantity;
            inventory.setStockQuantity(newQuantity);
            if (newQuantity == 0) {
                if (issue.getIssueType() == GoodsIssue.IssueType.SALE) {
                    inventory.setStatus(Inventory.InventoryStatus.SOLD_OUT);
                } else {
                    inventory.setStatus(Inventory.InventoryStatus.DISPOSED);
                }
            }
            Inventory savedInv = inventoryRepository.save(inventory);


            // Ghi nhật ký thẻ kho
            InventoryTransaction.TransactionType txType = (issue.getIssueType() == GoodsIssue.IssueType.SALE) 
                    ? InventoryTransaction.TransactionType.SALE 
                    : InventoryTransaction.TransactionType.EXPORT;

            InventoryTransaction transaction = InventoryTransaction.builder()
                    .transactionTime(LocalDateTime.now())
                    .type(txType)
                    .referenceId(issue.getIssueId())
                    .inventory(savedInv)
                    .quantityChanged(-baseQuantity) // Lượng xuất ghi âm
                    .endingBalance(savedInv.getStockQuantity())
                    .build();

            inventoryTransactionRepository.save(transaction);
        }

        issue.setStatus(GoodsIssue.IssueStatus.CONFIRMED);
        GoodsIssue saved = goodsIssueRepository.save(issue);
        return mapToResponse(saved);
    }

    @Transactional
    public GoodsIssueResponse cancelIssue(String issueId) {
        GoodsIssue issue = goodsIssueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu xuất kho với mã: " + issueId));

        // RÀNG BUỘC CHUYỂN TRẠNG THÁI: Chỉ cho phép chuyển sang CANCELLED từ DRAFT
        if (issue.getStatus() != GoodsIssue.IssueStatus.DRAFT) {
            throw new IllegalStateException("Chỉ có thể hủy phiếu xuất ở trạng thái NHÁP (DRAFT). Trạng thái hiện tại: " + issue.getStatus());
        }

        issue.setStatus(GoodsIssue.IssueStatus.CANCELLED);
        GoodsIssue saved = goodsIssueRepository.save(issue);
        return mapToResponse(saved);
    }

    private GoodsIssueResponse mapToResponse(GoodsIssue issue) {
        List<GoodsIssueResponse.DetailResponse> details = issue.getDetails().stream().map(d -> 
                GoodsIssueResponse.DetailResponse.builder()
                        .id(d.getId())
                        .inventoryId(d.getInventory().getId())
                        .medicineName(d.getInventory().getMedicine().getMedicineName())
                        .batchId(d.getInventory().getBatchId())
                        .quantity(d.getQuantity())
                        .transactionUnitName(d.getTransactionUnit() != null ? d.getTransactionUnit().getUnitName() : d.getInventory().getMedicine().getBaseUnit().getUnitName())
                        .conversionRate(d.getConversionRate())
                        .build()
        ).collect(Collectors.toList());

        return GoodsIssueResponse.builder()
                .issueId(issue.getIssueId())
                .issueTime(issue.getIssueTime())
                .employeeName(issue.getEmployee().getFullName())
                .issueType(issue.getIssueType().name())
                .note(issue.getNote())
                .status(issue.getStatus().name())
                .details(details)
                .build();
    }
}
