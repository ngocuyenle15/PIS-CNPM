package com.app.pis.service;

import com.app.pis.dto.OriginRequest;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Origin;
import com.app.pis.repository.MedicineRepository;
import com.app.pis.repository.OriginRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OriginService {

    private final OriginRepository originRepository;
    private final MedicineRepository medicineRepository;

    public List<Origin> getAll() {
        return originRepository.findAll();
    }

    public PagedResponse<Origin> getAll(int page, int size, String search) {
        Page<Origin> pageResult;
        if (org.springframework.util.StringUtils.hasText(search)) {
            pageResult = originRepository.findBySearch(search.trim(), PageRequest.of(page, size));
        } else {
            pageResult = originRepository.findAll(PageRequest.of(page, size));
        }
        return PagedResponse.<Origin>builder()
                .items(pageResult.getContent())
                .currentPage(pageResult.getNumber())
                .totalPages(pageResult.getTotalPages())
                .totalItems(pageResult.getTotalElements())
                .pageSize(pageResult.getSize())
                .build();
    }

    public Origin getById(String id) {
        return originRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xuất xứ thuốc với mã: " + id));
    }

    @Transactional
    public Origin create(OriginRequest request) {
        if (!StringUtils.hasText(request.getOriginID())) {
            throw new IllegalArgumentException("Mã xuất xứ không được để trống");
        }
        if (!StringUtils.hasText(request.getOriginName())) {
            throw new IllegalArgumentException("Tên xuất xứ không được để trống");
        }

        String originID = request.getOriginID().trim().toUpperCase();
        String originName = request.getOriginName().trim();

        if (originRepository.existsById(originID)) {
            throw new IllegalArgumentException("Mã xuất xứ '" + originID + "' đã tồn tại");
        }

        if (originRepository.existsByOriginName(originName)) {
            throw new IllegalArgumentException("Tên xuất xứ '" + originName + "' đã tồn tại");
        }

        Origin origin = new Origin(originID, originName);
        return originRepository.save(origin);
    }

    @Transactional
    public Origin patch(String id, OriginRequest request) {
        Origin origin = getById(id);

        if (StringUtils.hasText(request.getOriginName())) {
            String newName = request.getOriginName().trim();
            if (!newName.equals(origin.getOriginName())) {
                if (originRepository.existsByOriginName(newName)) {
                    throw new IllegalArgumentException("Tên xuất xứ '" + newName + "' đã tồn tại");
                }
                origin.setOriginName(newName);
            }
        }

        return originRepository.save(origin);
    }

    @Transactional
    public void delete(String id) {
        Origin origin = getById(id);

        if (medicineRepository.existsByOrigin(origin)) {
            throw new IllegalArgumentException("Không thể xóa xuất xứ '" + origin.getOriginName() + "' vì đang có thuốc tham chiếu đến xuất xứ này");
        }

        originRepository.delete(origin);
    }
}
