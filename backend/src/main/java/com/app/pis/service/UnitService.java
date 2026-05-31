package com.app.pis.service;

import com.app.pis.dto.UnitRequest;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Unit;
import com.app.pis.repository.MedicineRepository;
import com.app.pis.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;
    private final MedicineRepository medicineRepository;

    public List<Unit> getAll() {
        return unitRepository.findAll();
    }

    public PagedResponse<Unit> getAll(int page, int size, String search) {
        Page<Unit> pageResult;
        if (org.springframework.util.StringUtils.hasText(search)) {
            pageResult = unitRepository.findBySearch(search.trim(), PageRequest.of(page, size));
        } else {
            pageResult = unitRepository.findAll(PageRequest.of(page, size));
        }
        return PagedResponse.<Unit>builder()
                .items(pageResult.getContent())
                .currentPage(pageResult.getNumber())
                .totalPages(pageResult.getTotalPages())
                .totalItems(pageResult.getTotalElements())
                .pageSize(pageResult.getSize())
                .build();
    }

    public Unit getById(String id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị tính với mã: " + id));
    }

    @Transactional
    public Unit create(UnitRequest request) {
        if (!StringUtils.hasText(request.getUnitID())) {
            throw new IllegalArgumentException("Mã đơn vị tính không được để trống");
        }
        if (!StringUtils.hasText(request.getUnitName())) {
            throw new IllegalArgumentException("Tên đơn vị tính không được để trống");
        }

        String unitID = request.getUnitID().trim().toUpperCase();
        String unitName = request.getUnitName().trim();

        if (unitRepository.existsById(unitID)) {
            throw new IllegalArgumentException("Mã đơn vị tính '" + unitID + "' đã tồn tại");
        }

        if (unitRepository.existsByUnitName(unitName)) {
            throw new IllegalArgumentException("Tên đơn vị tính '" + unitName + "' đã tồn tại");
        }

        Unit unit = new Unit(unitID, unitName);
        return unitRepository.save(unit);
    }

    @Transactional
    public Unit patch(String id, UnitRequest request) {
        Unit unit = getById(id);

        if (StringUtils.hasText(request.getUnitName())) {
            String newName = request.getUnitName().trim();
            if (!newName.equals(unit.getUnitName())) {
                if (unitRepository.existsByUnitName(newName)) {
                    throw new IllegalArgumentException("Tên đơn vị tính '" + newName + "' đã tồn tại");
                }
                unit.setUnitName(newName);
            }
        }

        return unitRepository.save(unit);
    }

    @Transactional
    public void delete(String id) {
        Unit unit = getById(id);

        if (medicineRepository.existsByBaseUnit(unit)) {
            throw new IllegalArgumentException("Không thể xóa đơn vị tính '" + unit.getUnitName() + "' vì đang có thuốc sử dụng đơn vị này");
        }

        unitRepository.delete(unit);
    }
}
