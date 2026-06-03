package com.app.pis.service;

import com.app.pis.dto.PagedResponse;
import com.app.pis.dto.StockAuditRequest;
import com.app.pis.dto.StockAuditResponse;
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
public class StockAuditService {

    private final StockAuditRepository stockAuditRepository;
    private final StockAuditDetailRepository stockAuditDetailRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    @Transactional(readOnly = true)
    public PagedResponse<StockAuditResponse> getAll(
            String searchType, String searchVal,
            String startDate, String endDate,
            String status,
            int page, int size) {
        
        List<StockAudit> allAudits = stockAuditRepository.findAll();
        List<StockAudit> filtered = new ArrayList<>();

        java.time.LocalDate start = null;
        if (StringUtils.hasText(startDate)) {
            try { start = java.time.LocalDate.parse(startDate.trim()); } catch (Exception e) {}
        }
        java.time.LocalDate end = null;
        if (StringUtils.hasText(endDate)) {
            try { end = java.time.LocalDate.parse(endDate.trim()); } catch (Exception e) {}
        }

        for (StockAudit sa : allAudits) {
            boolean matchesSearch = true;
            if (StringUtils.hasText(searchType) && StringUtils.hasText(searchVal)) {
                String cleanVal = searchVal.trim().toLowerCase();
                if (searchType.equalsIgnoreCase("auditId")) {
                    matchesSearch = sa.getAuditId() != null && sa.getAuditId().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("batchId")) {
                    boolean matchBatch = false;
                    if (sa.getDetails() != null) {
                        for (StockAuditDetail detail : sa.getDetails()) {
                            if (detail.getInventory() != null && detail.getInventory().getBatchId() != null &&
                                detail.getInventory().getBatchId().toLowerCase().contains(cleanVal)) {
                                matchBatch = true;
                                break;
                            }
                        }
                    }
                    matchesSearch = matchBatch;
                } else if (searchType.equalsIgnoreCase("createdBy")) {
                    matchesSearch = sa.getCreatedBy() != null && sa.getCreatedBy().getFullName() != null &&
                                    sa.getCreatedBy().getFullName().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("approvedBy")) {
                    matchesSearch = sa.getApprovedBy() != null && sa.getApprovedBy().getFullName() != null &&
                                    sa.getApprovedBy().getFullName().toLowerCase().contains(cleanVal);
                } else if (searchType.equalsIgnoreCase("status")) {
                    matchesSearch = sa.getStatus() != null && sa.getStatus().name().toLowerCase().contains(cleanVal);
                }
            }

            boolean matchesDate = true;
            if (sa.getAuditTime() != null) {
                java.time.LocalDate saDate = sa.getAuditTime().toLocalDate();
                if (start != null && saDate.isBefore(start)) {
                    matchesDate = false;
                }
                if (end != null && saDate.isAfter(end)) {
                    matchesDate = false;
                }
            } else if (start != null || end != null) {
                matchesDate = false;
            }

            boolean matchesStatus = true;
            if (StringUtils.hasText(status)) {
                if (status.equalsIgnoreCase("UNPROCESSED")) {
                    matchesStatus = sa.getStatus() != StockAudit.AuditStatus.CONFIRMED;
                } else if (!status.equalsIgnoreCase("ALL")) {
                    matchesStatus = sa.getStatus() != null && sa.getStatus().name().equalsIgnoreCase(status.trim());
                }
            }

            if (matchesSearch && matchesDate && matchesStatus) {
                filtered.add(sa);
            }
        }

        int totalItems = filtered.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        if (totalPages == 0) totalPages = 1;

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);
        List<StockAudit> pagedList = new ArrayList<>();
        if (fromIndex < totalItems) {
            pagedList = filtered.subList(fromIndex, toIndex);
        }

        List<StockAuditResponse> responses = pagedList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<StockAuditResponse>builder()
                .items(responses)
                .currentPage(page)
                .totalPages(totalPages)
                .totalItems(totalItems)
                .pageSize(size)
                .build();
    }

    @Transactional(readOnly = true)
    public StockAuditResponse getById(String id) {
        StockAudit audit = stockAuditRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu kiểm kê kho với mã: " + id));
        return mapToResponse(audit);
    }

    @Transactional
    public StockAuditResponse createAuditDraft(StockAuditRequest request, Employee currentEmployee) {
        String auditId = request.getAuditId();
        if (!StringUtils.hasText(auditId)) {
            auditId = "AUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } else {
            auditId = auditId.trim().toUpperCase();
            if (stockAuditRepository.existsById(auditId)) {
                throw new IllegalArgumentException("Mã phiếu kiểm kê '" + auditId + "' đã tồn tại");
            }
        }

        StockAudit audit = new StockAudit();
        audit.setAuditId(auditId);
        audit.setCreatedBy(currentEmployee);
        audit.setNote(request.getNote());
        audit.setStatus(StockAudit.AuditStatus.IN_PROGRESS);

        // Tự động chụp tồn kho hệ thống (systemQuantity) cho toàn bộ lô đang có trong kho
        List<Inventory> allInventory = inventoryRepository.findAll();
        List<StockAuditDetail> details = new ArrayList<>();
        
        for (Inventory inv : allInventory) {
            // Chỉ kiểm kê những lô đang có hàng hoặc tồn kho khác 0
            if (inv.getStockQuantity() >= 0) {
                StockAuditDetail detail = new StockAuditDetail();
                detail.setAudit(audit);
                detail.setInventory(inv);
                detail.setSystemQuantity(inv.getStockQuantity());
                detail.setActualQuantity(inv.getStockQuantity()); // Mặc định bằng số lượng sổ sách để thuận tiện đối soát ngoại lệ
                detail.setDiscrepancy(0); // Mặc định chênh lệch bằng 0
                
                details.add(detail);
            }
        }


        audit.setDetails(details);
        StockAudit saved = stockAuditRepository.save(audit);
        return mapToResponse(saved);
    }

    @Transactional
    public StockAuditResponse startAuditCount(String auditId) {
        StockAudit audit = stockAuditRepository.findById(auditId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu kiểm kê với mã: " + auditId));

        // RÀNG BUỘC TRẠNG THÁI: DRAFT -> IN_PROGRESS
        if (audit.getStatus() != StockAudit.AuditStatus.DRAFT) {
            throw new IllegalStateException("Phiếu kiểm kê phải ở trạng thái ĐANG XỬ LÝ (DRAFT) mới có thể bắt đầu kiểm kho. Trạng thái hiện tại: " + audit.getStatus());
        }

        audit.setStatus(StockAudit.AuditStatus.IN_PROGRESS);
        StockAudit saved = stockAuditRepository.save(audit);
        return mapToResponse(saved);
    }

    @Transactional
    public StockAuditResponse saveAuditDraftQuantity(String auditId, StockAuditRequest request) {
        StockAudit audit = stockAuditRepository.findById(auditId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu kiểm kê với mã: " + auditId));

        // RÀNG BUỘC TRẠNG THÁI: Phải ở trạng thái DRAFT hoặc IN_PROGRESS mới được cập nhật số đếm
        if (audit.getStatus() != StockAudit.AuditStatus.DRAFT && audit.getStatus() != StockAudit.AuditStatus.IN_PROGRESS) {
            throw new IllegalStateException("Chỉ được nhập số đếm thực tế khi phiếu ở trạng thái ĐANG XỬ LÝ (DRAFT) hoặc ĐANG THỰC HIỆN (IN_PROGRESS). Trạng thái hiện tại: " + audit.getStatus());
        }

        if (audit.getStatus() == StockAudit.AuditStatus.DRAFT) {
            audit.setStatus(StockAudit.AuditStatus.IN_PROGRESS);
        }

        if (request.getDetails() != null) {
            for (StockAuditRequest.DetailRequest reqDetail : request.getDetails()) {
                StockAuditDetail detail = audit.getDetails().stream()
                        .filter(d -> d.getInventory().getId().equals(reqDetail.getInventoryId()))
                        .findFirst()
                        .orElse(null);

                if (detail != null) {
                    detail.setActualQuantity(reqDetail.getActualQuantity());
                    if (reqDetail.getActualQuantity() != null) {
                        detail.setDiscrepancy(reqDetail.getActualQuantity() - detail.getSystemQuantity());
                    } else {
                        detail.setDiscrepancy(null);
                    }
                    if (StringUtils.hasText(reqDetail.getNote())) {
                        detail.setNote(reqDetail.getNote());
                    }
                }
            }
        }

        if (StringUtils.hasText(request.getNote())) {
            audit.setNote(request.getNote());
        }

        StockAudit saved = stockAuditRepository.save(audit);
        return mapToResponse(saved);
    }

    @Transactional
    public StockAuditResponse confirmAudit(String auditId, Employee approvedByEmployee) {
        StockAudit audit = stockAuditRepository.findById(auditId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu kiểm kê với mã: " + auditId));

        // RÀNG BUỘC TRẠNG THÁI: DRAFT hoặc IN_PROGRESS -> CONFIRMED
        if (audit.getStatus() != StockAudit.AuditStatus.DRAFT && audit.getStatus() != StockAudit.AuditStatus.IN_PROGRESS) {
            throw new IllegalStateException("Chỉ hoàn thành kiểm kê khi phiếu ở trạng thái ĐANG XỬ LÝ (DRAFT) hoặc ĐANG THỰC HIỆN (IN_PROGRESS). Trạng thái hiện tại: " + audit.getStatus());
        }

        // KIỂM TRA ĐÃ ĐIỀN ĐỦ SỐ THỰC TẾ CHƯA
        for (StockAuditDetail detail : audit.getDetails()) {
            if (detail.getActualQuantity() == null) {
                throw new IllegalArgumentException("Vui lòng nhập đầy đủ Số lượng thực tế cho tất cả các lô thuốc trước khi hoàn thành đối soát!");
            }
        }

        // Tiến hành cập nhật tồn kho thực tế và ghi log biến động
        for (StockAuditDetail detail : audit.getDetails()) {
            Inventory inventory = detail.getInventory();
            int discrepancy = detail.getDiscrepancy();

            // Cập nhật tồn kho theo số thực đếm
            int actualQuantity = detail.getActualQuantity();
            inventory.setStockQuantity(actualQuantity);
            if (actualQuantity == 0) {
                inventory.setStatus(Inventory.InventoryStatus.ADJUSTED);
            } else {
                inventory.setStatus(Inventory.InventoryStatus.ACTIVE);
            }
            Inventory savedInv = inventoryRepository.save(inventory);


            // Ghi nhật ký thẻ kho loại AUDIT_ADJUST
            if (discrepancy != 0) {
                InventoryTransaction transaction = InventoryTransaction.builder()
                        .transactionTime(LocalDateTime.now())
                        .type(InventoryTransaction.TransactionType.AUDIT_ADJUST)
                        .referenceId(audit.getAuditId())
                        .inventory(savedInv)
                        .quantityChanged(discrepancy) // Ghi nhận giá trị chênh lệch dương (thừa) hoặc âm (thiếu)
                        .endingBalance(savedInv.getStockQuantity())
                        .build();

                inventoryTransactionRepository.save(transaction);
            }
        }

        audit.setStatus(StockAudit.AuditStatus.CONFIRMED);
        audit.setApprovedBy(approvedByEmployee);
        StockAudit saved = stockAuditRepository.save(audit);
        return mapToResponse(saved);
    }

    @Transactional
    public StockAuditResponse cancelAudit(String auditId) {
        StockAudit audit = stockAuditRepository.findById(auditId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu kiểm kê với mã: " + auditId));

        // RÀNG BUỘC TRẠNG THÁI: DRAFT/IN_PROGRESS -> CANCELLED
        if (audit.getStatus() != StockAudit.AuditStatus.DRAFT && audit.getStatus() != StockAudit.AuditStatus.IN_PROGRESS) {
            throw new IllegalStateException("Không thể hủy phiếu kiểm kê đã hoàn thành! Trạng thái hiện tại: " + audit.getStatus());
        }

        audit.setStatus(StockAudit.AuditStatus.CANCELLED);
        StockAudit saved = stockAuditRepository.save(audit);
        return mapToResponse(saved);
    }

    private StockAuditResponse mapToResponse(StockAudit audit) {
        List<StockAuditResponse.DetailResponse> details = audit.getDetails().stream().map(d -> 
                StockAuditResponse.DetailResponse.builder()
                        .id(d.getId())
                        .inventoryId(d.getInventory().getId())
                        .medicineName(d.getInventory().getMedicine().getMedicineName())
                        .batchId(d.getInventory().getBatchId())
                        .systemQuantity(d.getSystemQuantity())
                        .actualQuantity(d.getActualQuantity())
                        .discrepancy(d.getDiscrepancy())
                        .note(d.getNote())
                        .unitName(d.getInventory().getMedicine().getBaseUnit() != null ? d.getInventory().getMedicine().getBaseUnit().getUnitName() : null)
                        .build()
        ).collect(Collectors.toList());

        return StockAuditResponse.builder()
                .auditId(audit.getAuditId())
                .auditTime(audit.getAuditTime())
                .createdByName(audit.getCreatedBy().getFullName())
                .approvedByName(audit.getApprovedBy() != null ? audit.getApprovedBy().getFullName() : null)
                .note(audit.getNote())
                .status(audit.getStatus().name())
                .details(details)
                .build();
    }
}
