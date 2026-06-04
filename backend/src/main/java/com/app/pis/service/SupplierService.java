package com.app.pis.service;

import com.app.pis.dto.SupplierRequest;
import com.app.pis.entity.Supplier;
import com.app.pis.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier getById(String id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà cung cấp với mã: " + id));
    }

    @Transactional
    public Supplier create(SupplierRequest request) {
        if (!StringUtils.hasText(request.getSupplierID())) {
            throw new IllegalArgumentException("Mã nhà cung cấp không được để trống");
        }
        if (!StringUtils.hasText(request.getSupplierName())) {
            throw new IllegalArgumentException("Tên nhà cung cấp không được để trống");
        }
        if (!StringUtils.hasText(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Số điện thoại không được để trống");
        }
        if (!StringUtils.hasText(request.getAddress())) {
            throw new IllegalArgumentException("Địa chỉ không được để trống");
        }

        String supplierID = request.getSupplierID().trim().toUpperCase();
        String supplierName = request.getSupplierName().trim();
        String phoneNumber = request.getPhoneNumber().trim();

        if (supplierRepository.existsById(supplierID)) {
            throw new IllegalArgumentException("Mã nhà cung cấp '" + supplierID + "' đã tồn tại");
        }

        if (supplierRepository.existsBySupplierName(supplierName)) {
            throw new IllegalArgumentException("Tên nhà cung cấp '" + supplierName + "' đã tồn tại");
        }

        if (supplierRepository.existsByPhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("Số điện thoại '" + phoneNumber + "' đã được sử dụng");
        }

        Supplier supplier = new Supplier();
        supplier.setSupplierID(supplierID);
        supplier.setSupplierName(supplierName);
        supplier.setPhoneNumber(phoneNumber);
        supplier.setAddress(request.getAddress().trim());

        return supplierRepository.save(supplier);
    }

    @Transactional
    public Supplier patch(String id, SupplierRequest request) {
        Supplier supplier = getById(id);

        if (StringUtils.hasText(request.getSupplierName())) {
            String newName = request.getSupplierName().trim();
            if (!newName.equals(supplier.getSupplierName())) {
                if (supplierRepository.existsBySupplierName(newName)) {
                    throw new IllegalArgumentException("Tên nhà cung cấp '" + newName + "' đã tồn tại");
                }
                supplier.setSupplierName(newName);
            }
        }

        if (StringUtils.hasText(request.getPhoneNumber())) {
            String newPhone = request.getPhoneNumber().trim();
            if (!newPhone.equals(supplier.getPhoneNumber())) {
                if (supplierRepository.existsByPhoneNumber(newPhone)) {
                    throw new IllegalArgumentException("Số điện thoại '" + newPhone + "' đã được sử dụng");
                }
                supplier.setPhoneNumber(newPhone);
            }
        }

        if (StringUtils.hasText(request.getAddress())) {
            supplier.setAddress(request.getAddress().trim());
        }

        return supplierRepository.save(supplier);
    }

    @Transactional
    public void delete(String id) {
        Supplier supplier = getById(id);

        try {
            supplierRepository.delete(supplier);
            supplierRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalArgumentException("Không thể xóa nhà cung cấp '" + supplier.getSupplierName() + "' vì đã phát sinh lịch sử nhập kho");
        }
    }
}
