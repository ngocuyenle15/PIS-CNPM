package com.app.pis.service;

import com.app.pis.dto.CatalogRequest;
import com.app.pis.dto.PagedResponse;
import com.app.pis.entity.Catalog;
import com.app.pis.repository.CatalogRepository;
import com.app.pis.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CatalogRepository catalogRepository;
    private final MedicineRepository medicineRepository;

    public List<Catalog> getAll() {
        return catalogRepository.findAll();
    }

    public PagedResponse<Catalog> getAll(int page, int size, String search) {
        Page<Catalog> pageResult;
        if (org.springframework.util.StringUtils.hasText(search)) {
            pageResult = catalogRepository.findBySearch(search.trim(), PageRequest.of(page, size));
        } else {
            pageResult = catalogRepository.findAll(PageRequest.of(page, size));
        }
        return PagedResponse.<Catalog>builder()
                .items(pageResult.getContent())
                .currentPage(pageResult.getNumber())
                .totalPages(pageResult.getTotalPages())
                .totalItems(pageResult.getTotalElements())
                .pageSize(pageResult.getSize())
                .build();
    }

    public Catalog getById(String id) {
        return catalogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục thuốc với mã: " + id));
    }

    @Transactional
    public Catalog create(CatalogRequest request) {
        if (!StringUtils.hasText(request.getCatalogID())) {
            throw new IllegalArgumentException("Mã danh mục không được để trống");
        }
        if (!StringUtils.hasText(request.getCatalogName())) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }

        String catalogID = request.getCatalogID().trim().toUpperCase();
        String catalogName = request.getCatalogName().trim();

        if (catalogRepository.existsById(catalogID)) {
            throw new IllegalArgumentException("Mã danh mục '" + catalogID + "' đã tồn tại");
        }

        if (catalogRepository.existsByCatalogName(catalogName)) {
            throw new IllegalArgumentException("Tên danh mục '" + catalogName + "' đã tồn tại");
        }

        Catalog catalog = new Catalog(catalogID, catalogName);
        return catalogRepository.save(catalog);
    }

    @Transactional
    public Catalog patch(String id, CatalogRequest request) {
        Catalog catalog = getById(id);

        if (StringUtils.hasText(request.getCatalogName())) {
            String newName = request.getCatalogName().trim();
            if (!newName.equals(catalog.getCatalogName())) {
                if (catalogRepository.existsByCatalogName(newName)) {
                    throw new IllegalArgumentException("Tên danh mục '" + newName + "' đã tồn tại");
                }
                catalog.setCatalogName(newName);
            }
        }

        return catalogRepository.save(catalog);
    }

    @Transactional
    public void delete(String id) {
        Catalog catalog = getById(id);

        if (medicineRepository.existsByCatalog(catalog)) {
            throw new IllegalArgumentException("Không thể xóa danh mục '" + catalog.getCatalogName() + "' vì đang có thuốc thuộc danh mục này");
        }

        catalogRepository.delete(catalog);
    }
}
