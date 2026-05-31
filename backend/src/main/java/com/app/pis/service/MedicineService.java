package com.app.pis.service;

import com.app.pis.dto.MedicineRequest;
import com.app.pis.dto.MedicineResponse;
import com.app.pis.dto.MedicineUnitRequest;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Catalog;
import com.app.pis.entity.Medicine;
import com.app.pis.entity.MedicineUnit;
import com.app.pis.entity.Origin;
import com.app.pis.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.app.pis.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineUnitRepository medicineUnitRepository;
    private final UnitRepository unitRepository;
    private final CatalogRepository catalogRepository;
    private final OriginRepository originRepository;

    public PagedResponse<MedicineResponse> getAll(String search, String searchField, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Medicine> medicinesPage;
        if (StringUtils.hasText(search) && StringUtils.hasText(searchField)) {
            String trimSearch = search.trim();
            switch (searchField) {
                case "medicineName":
                    medicinesPage = medicineRepository.findByMedicineNameContainingIgnoreCase(trimSearch, pageable);
                    break;
                case "medicineID":
                    medicinesPage = medicineRepository.findByMedicineIDContainingIgnoreCase(trimSearch, pageable);
                    break;
                case "ingredients":
                    medicinesPage = medicineRepository.findByIngredientsContainingIgnoreCase(trimSearch, pageable);
                    break;
                case "catalog":
                    medicinesPage = medicineRepository.findByCatalogCatalogNameContainingIgnoreCase(trimSearch, pageable);
                    break;
                case "origin":
                    medicinesPage = medicineRepository.findByOriginOriginNameContainingIgnoreCase(trimSearch, pageable);
                    break;
                default:
                    medicinesPage = medicineRepository.findAll(pageable);
            }
        } else {
            medicinesPage = medicineRepository.findAll(pageable);
        }

        List<MedicineResponse> items = medicinesPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<MedicineResponse>builder()
                .items(items)
                .currentPage(medicinesPage.getNumber())
                .totalPages(medicinesPage.getTotalPages())
                .totalItems(medicinesPage.getTotalElements())
                .pageSize(medicinesPage.getSize())
                .build();
    }

    public MedicineResponse getById(String id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thuốc với mã: " + id));
        return convertToResponse(medicine);
    }

    @Transactional
    public MedicineResponse create(MedicineRequest request) {
        if (!StringUtils.hasText(request.getMedicineID())) {
            throw new IllegalArgumentException("Mã thuốc không được để trống");
        }
        if (!StringUtils.hasText(request.getMedicineName())) {
            throw new IllegalArgumentException("Tên thuốc không được để trống");
        }
        if (!StringUtils.hasText(request.getUnitID())) {
            throw new IllegalArgumentException("Đơn vị tính cơ sở không được để trống");
        }
        if (!StringUtils.hasText(request.getCatalogID())) {
            throw new IllegalArgumentException("Danh mục thuốc không được để trống");
        }
        if (!StringUtils.hasText(request.getOriginID())) {
            throw new IllegalArgumentException("Xuất xứ thuốc không được để trống");
        }
        if (request.getUnitPrice() == null) {
            throw new IllegalArgumentException("Đơn giá thuốc không được để trống");
        }

        String medicineID = request.getMedicineID().trim().toUpperCase();
        String medicineName = request.getMedicineName().trim();

        if (medicineRepository.existsById(medicineID)) {
            throw new IllegalArgumentException("Mã thuốc '" + medicineID + "' đã tồn tại");
        }

        Unit baseUnit = unitRepository.findById(request.getUnitID())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị tính với mã: " + request.getUnitID()));

        Catalog catalog = catalogRepository.findById(request.getCatalogID())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục với mã: " + request.getCatalogID()));

        Origin origin = originRepository.findById(request.getOriginID())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xuất xứ với mã: " + request.getOriginID()));

        Medicine medicine = new Medicine();
        medicine.setMedicineID(medicineID);
        medicine.setMedicineName(medicineName);
        medicine.setImage(request.getImage());
        medicine.setIngredients(request.getIngredients());
        medicine.setBaseUnit(baseUnit);
        medicine.setCatalog(catalog);
        medicine.setOrigin(origin);
        medicine.setUnitPrice(request.getUnitPrice());

        Medicine savedMedicine = medicineRepository.save(medicine);

        List<MedicineUnit> savedAlternativeUnits = new ArrayList<>();
        if (request.getAlternativeUnits() != null && !request.getAlternativeUnits().isEmpty()) {
            for (MedicineUnitRequest altRequest : request.getAlternativeUnits()) {
                if (altRequest.getUnitID().trim().equalsIgnoreCase(baseUnit.getUnitID())) {
                    throw new IllegalArgumentException("Đơn vị quy đổi không được trùng với đơn vị gốc '" + baseUnit.getUnitName() + "'");
                }

                Unit altUnit = unitRepository.findById(altRequest.getUnitID())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị quy đổi phụ với mã: " + altRequest.getUnitID()));

                MedicineUnit medicineUnit = new MedicineUnit();
                medicineUnit.setMedicine(savedMedicine);
                medicineUnit.setUnit(altUnit);
                medicineUnit.setConversionRate(altRequest.getConversionRate());

                savedAlternativeUnits.add(medicineUnitRepository.save(medicineUnit));
            }
        }

        return convertToResponse(savedMedicine, savedAlternativeUnits);
    }

    @Transactional
    public MedicineResponse patch(String id, MedicineRequest request) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thuốc với mã: " + id));

        if (StringUtils.hasText(request.getMedicineName())) {
            medicine.setMedicineName(request.getMedicineName().trim());
        }

        if (request.getImage() != null) {
            medicine.setImage(request.getImage());
        }

        if (request.getIngredients() != null) {
            medicine.setIngredients(request.getIngredients());
        }

        if (request.getUnitPrice() != null) {
            medicine.setUnitPrice(request.getUnitPrice());
        }

        if (StringUtils.hasText(request.getUnitID())) {
            Unit newBaseUnit = unitRepository.findById(request.getUnitID())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị tính với mã: " + request.getUnitID()));
            medicine.setBaseUnit(newBaseUnit);
        }

        if (StringUtils.hasText(request.getCatalogID())) {
            Catalog newCatalog = catalogRepository.findById(request.getCatalogID())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục với mã: " + request.getCatalogID()));
            medicine.setCatalog(newCatalog);
        }

        if (StringUtils.hasText(request.getOriginID())) {
            Origin newOrigin = originRepository.findById(request.getOriginID())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xuất xứ với mã: " + request.getOriginID()));
            medicine.setOrigin(newOrigin);
        }

        Medicine savedMedicine = medicineRepository.save(medicine);

        if (request.getAlternativeUnits() != null) {
            // Delete old conversions
            medicineUnitRepository.deleteByMedicine(savedMedicine);

            // Insert new conversions
            List<MedicineUnit> newAlternativeUnits = new ArrayList<>();
            String baseUnitId = savedMedicine.getBaseUnit().getUnitID();

            for (MedicineUnitRequest altRequest : request.getAlternativeUnits()) {
                if (altRequest.getUnitID().trim().equalsIgnoreCase(baseUnitId)) {
                    throw new IllegalArgumentException("Đơn vị quy đổi không được trùng với đơn vị gốc của thuốc");
                }

                Unit altUnit = unitRepository.findById(altRequest.getUnitID())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị quy đổi phụ với mã: " + altRequest.getUnitID()));

                MedicineUnit medicineUnit = new MedicineUnit();
                medicineUnit.setMedicine(savedMedicine);
                medicineUnit.setUnit(altUnit);
                medicineUnit.setConversionRate(altRequest.getConversionRate());

                newAlternativeUnits.add(medicineUnitRepository.save(medicineUnit));
            }
            return convertToResponse(savedMedicine, newAlternativeUnits);
        }

        return convertToResponse(savedMedicine);
    }

    @Transactional
    public void delete(String id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thuốc với mã: " + id));

        // Delete dependencies first in conversion table to prevent constraint failure
        medicineUnitRepository.deleteByMedicine(medicine);

        try {
            medicineRepository.delete(medicine);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalArgumentException("Không thể xóa thuốc '" + medicine.getMedicineName() + "' vì dữ liệu đã phát sinh giao dịch trong hệ thống (Hóa đơn, đơn hàng, hoặc tồn kho)");
        }
    }

    private MedicineResponse convertToResponse(Medicine medicine) {
        List<MedicineUnit> units = medicineUnitRepository.findByMedicine(medicine);
        return convertToResponse(medicine, units);
    }

    private MedicineResponse convertToResponse(Medicine medicine, List<MedicineUnit> alternativeUnits) {
        MedicineResponse.UnitInfo baseUnitInfo = null;
        if (medicine.getBaseUnit() != null) {
            baseUnitInfo = MedicineResponse.UnitInfo.builder()
                    .unitID(medicine.getBaseUnit().getUnitID())
                    .unitName(medicine.getBaseUnit().getUnitName())
                    .build();
        }

        MedicineResponse.CatalogInfo catalogInfo = null;
        if (medicine.getCatalog() != null) {
            catalogInfo = MedicineResponse.CatalogInfo.builder()
                    .catalogID(medicine.getCatalog().getCatalogID())
                    .catalogName(medicine.getCatalog().getCatalogName())
                    .build();
        }

        MedicineResponse.OriginInfo originInfo = null;
        if (medicine.getOrigin() != null) {
            originInfo = MedicineResponse.OriginInfo.builder()
                    .originID(medicine.getOrigin().getOriginID())
                    .originName(medicine.getOrigin().getOriginName())
                    .build();
        }

        List<MedicineResponse.AlternativeUnitInfo> altUnitInfos = alternativeUnits.stream()
                .map(mu -> MedicineResponse.AlternativeUnitInfo.builder()
                        .unitID(mu.getUnit().getUnitID())
                        .unitName(mu.getUnit().getUnitName())
                        .conversionRate(mu.getConversionRate())
                        .build())
                .collect(Collectors.toList());

        return MedicineResponse.builder()
                .medicineID(medicine.getMedicineID())
                .medicineName(medicine.getMedicineName())
                .image(medicine.getImage())
                .ingredients(medicine.getIngredients())
                .unitPrice(medicine.getUnitPrice())
                .baseUnit(baseUnitInfo)
                .catalog(catalogInfo)
                .origin(originInfo)
                .alternativeUnits(altUnitInfos)
                .build();
    }
}
