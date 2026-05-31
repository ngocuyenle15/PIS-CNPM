package com.app.pis.service;

import com.app.pis.dto.InventoryResponse;
import com.app.pis.dto.InventoryTransactionResponse;
import com.app.pis.dto.MedicineResponse;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Inventory;
import com.app.pis.entity.InventoryTransaction;
import com.app.pis.entity.Medicine;
import com.app.pis.entity.MedicineUnit;
import com.app.pis.repository.InventoryRepository;
import com.app.pis.repository.InventoryTransactionRepository;
import com.app.pis.repository.MedicineUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final MedicineUnitRepository medicineUnitRepository;

    @Transactional(readOnly = true)
    public PagedResponse<InventoryResponse> getAll(
            String search, String type, 
            String catalogId, String originId,
            Integer minStock, Integer maxStock,
            String startExpiry, String endExpiry,
            int page, int size) {
        
        List<Inventory> allInventory = inventoryRepository.findAll();
        List<Inventory> filtered = new ArrayList<>();

        LocalDate sixMonthsLater = LocalDate.now().plusMonths(6);
        
        LocalDate startExpDate = null;
        if (StringUtils.hasText(startExpiry)) {
            try {
                startExpDate = LocalDate.parse(startExpiry.trim());
            } catch (Exception e) {
                // Ignore parse exception
            }
        }
        LocalDate endExpDate = null;
        if (StringUtils.hasText(endExpiry)) {
            try {
                endExpDate = LocalDate.parse(endExpiry.trim());
            } catch (Exception e) {
                // Ignore parse exception
            }
        }

        for (Inventory inv : allInventory) {
            boolean matchesSearch = true;
            if (StringUtils.hasText(search)) {
                String cleanSearch = search.trim().toLowerCase();
                String medName = inv.getMedicine().getMedicineName().toLowerCase();
                String batchId = inv.getBatchId().toLowerCase();
                matchesSearch = medName.contains(cleanSearch) || batchId.contains(cleanSearch);
            }

            boolean matchesType = true;
            if (StringUtils.hasText(type)) {
                if (type.equalsIgnoreCase("NEAR_EXPIRY")) {
                    matchesType = inv.getExpiryDate() != null && inv.getExpiryDate().isBefore(sixMonthsLater) && inv.getExpiryDate().isAfter(LocalDate.now());
                } else if (type.equalsIgnoreCase("EXPIRED")) {
                    matchesType = inv.getExpiryDate() != null && (inv.getExpiryDate().isBefore(LocalDate.now()) || inv.getExpiryDate().isEqual(LocalDate.now()));
                } else if (type.equalsIgnoreCase("LOW_STOCK")) {
                    matchesType = inv.getStockQuantity() < 20; // Ngưỡng tồn kho thấp
                }
            }

            boolean matchesCatalog = true;
            if (StringUtils.hasText(catalogId)) {
                matchesCatalog = inv.getMedicine().getCatalog() != null && 
                        inv.getMedicine().getCatalog().getCatalogID().equalsIgnoreCase(catalogId.trim());
            }

            boolean matchesOrigin = true;
            if (StringUtils.hasText(originId)) {
                matchesOrigin = inv.getMedicine().getOrigin() != null && 
                        inv.getMedicine().getOrigin().getOriginID().equalsIgnoreCase(originId.trim());
            }

            boolean matchesStockRange = true;
            if (minStock != null) {
                matchesStockRange = inv.getStockQuantity() >= minStock;
            }
            if (maxStock != null && matchesStockRange) {
                matchesStockRange = inv.getStockQuantity() <= maxStock;
            }

            boolean matchesExpiryRange = true;
            if (startExpDate != null || endExpDate != null) {
                if (inv.getExpiryDate() != null) {
                    if (startExpDate != null) {
                        matchesExpiryRange = !inv.getExpiryDate().isBefore(startExpDate);
                    }
                    if (endExpDate != null && matchesExpiryRange) {
                        matchesExpiryRange = !inv.getExpiryDate().isAfter(endExpDate);
                    }
                } else {
                    matchesExpiryRange = false;
                }
            }

            if (matchesSearch && matchesType && matchesCatalog && matchesOrigin && matchesStockRange && matchesExpiryRange) {
                filtered.add(inv);
            }
        }

        // Phân trang thủ công vì JPA findAll() với lọc bộ nhớ trong trường hợp dữ liệu vừa phải
        int totalItems = filtered.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        if (totalPages == 0) totalPages = 1;

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);
        List<Inventory> pagedList = new ArrayList<>();
        if (fromIndex < totalItems) {
            pagedList = filtered.subList(fromIndex, toIndex);
        }

        List<InventoryResponse> responses = pagedList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<InventoryResponse>builder()
                .items(responses)
                .currentPage(page)
                .totalPages(totalPages)
                .totalItems(totalItems)
                .pageSize(size)
                .build();
    }

    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getTransactions(String searchMedicineId) {
        List<InventoryTransaction> transactions;
        if (StringUtils.hasText(searchMedicineId)) {
            transactions = inventoryTransactionRepository.findByInventoryMedicineMedicineIDOrderByTransactionTimeAsc(searchMedicineId.trim());
        } else {
            transactions = inventoryTransactionRepository.findAll();
        }

        return transactions.stream().map(tx -> InventoryTransactionResponse.builder()
                .id(tx.getId())
                .transactionTime(tx.getTransactionTime())
                .type(tx.getType().name())
                .referenceId(tx.getReferenceId())
                .inventoryId(tx.getInventory().getId())
                .batchId(tx.getInventory().getBatchId())
                .medicineName(tx.getInventory().getMedicine().getMedicineName())
                .quantityChanged(tx.getQuantityChanged())
                .endingBalance(tx.getEndingBalance())
                .build()
        ).collect(Collectors.toList());
    }

    public InventoryResponse mapToResponse(Inventory inventory) {
        Medicine med = inventory.getMedicine();
        
        List<MedicineResponse.AlternativeUnitInfo> altUnitInfos = medicineUnitRepository.findByMedicine(med).stream()
                .map(mu -> MedicineResponse.AlternativeUnitInfo.builder()
                        .unitID(mu.getUnit().getUnitID())
                        .unitName(mu.getUnit().getUnitName())
                        .conversionRate(mu.getConversionRate())
                        .build())
                .collect(Collectors.toList());

        MedicineResponse medResponse = MedicineResponse.builder()
                .medicineID(med.getMedicineID())
                .medicineName(med.getMedicineName())
                .image(med.getImage())
                .ingredients(med.getIngredients())
                .unitPrice(med.getUnitPrice())
                .baseUnit(MedicineResponse.UnitInfo.builder()
                        .unitID(med.getBaseUnit().getUnitID())
                        .unitName(med.getBaseUnit().getUnitName())
                        .build())
                .catalog(MedicineResponse.CatalogInfo.builder()
                        .catalogID(med.getCatalog().getCatalogID())
                        .catalogName(med.getCatalog().getCatalogName())
                        .build())
                .origin(MedicineResponse.OriginInfo.builder()
                        .originID(med.getOrigin().getOriginID())
                        .originName(med.getOrigin().getOriginName())
                        .build())
                .alternativeUnits(altUnitInfos)
                .build();

        return InventoryResponse.builder()
                .id(inventory.getId())
                .batchId(inventory.getBatchId())
                .importPrice(inventory.getImportPrice())
                .stockQuantity(inventory.getStockQuantity())
                .expiryDate(inventory.getExpiryDate())
                .manufacturedDate(inventory.getManufacturedDate())
                .status(inventory.getStatus() != null ? inventory.getStatus().name() : "ACTIVE")
                .medicine(medResponse)
                .build();


    }
}
