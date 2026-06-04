package com.app.pis.service;

import com.app.pis.dto.CustomerRequest;
import com.app.pis.entity.Customer;
import com.app.pis.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Customer getById(String id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với mã: " + id));
    }

    @Transactional
    public Customer create(CustomerRequest request) {
        if (!StringUtils.hasText(request.getCustomerID())) {
            throw new IllegalArgumentException("Mã khách hàng không được để trống");
        }
        if (!StringUtils.hasText(request.getFullName())) {
            throw new IllegalArgumentException("Họ tên khách hàng không được để trống");
        }
        if (!StringUtils.hasText(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Số điện thoại không được để trống");
        }
        if (request.getGender() == null) {
            throw new IllegalArgumentException("Giới tính không được để trống");
        }

        String customerID = request.getCustomerID().trim().toUpperCase();
        String phoneNumber = request.getPhoneNumber().trim();

        if (customerRepository.existsById(customerID)) {
            throw new IllegalArgumentException("Mã khách hàng '" + customerID + "' đã tồn tại");
        }

        if (customerRepository.existsByPhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("Số điện thoại '" + phoneNumber + "' đã được sử dụng");
        }

        Customer customer = new Customer();
        customer.setCustomerID(customerID);
        customer.setFullName(request.getFullName().trim());
        customer.setPhoneNumber(phoneNumber);
        customer.setGender(request.getGender());

        return customerRepository.save(customer);
    }

    @Transactional
    public Customer patch(String id, CustomerRequest request) {
        Customer customer = getById(id);

        if (StringUtils.hasText(request.getFullName())) {
            customer.setFullName(request.getFullName().trim());
        }

        if (StringUtils.hasText(request.getPhoneNumber())) {
            String newPhone = request.getPhoneNumber().trim();
            if (!newPhone.equals(customer.getPhoneNumber())) {
                if (customerRepository.existsByPhoneNumber(newPhone)) {
                    throw new IllegalArgumentException("Số điện thoại '" + newPhone + "' đã được sử dụng");
                }
                customer.setPhoneNumber(newPhone);
            }
        }

        if (request.getGender() != null) {
            customer.setGender(request.getGender());
        }

        return customerRepository.save(customer);
    }

    @Transactional
    public void delete(String id) {
        Customer customer = getById(id);

        try {
            customerRepository.delete(customer);
            customerRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalArgumentException("Không thể xóa khách hàng '" + customer.getFullName() + "' vì đã phát sinh lịch sử hóa đơn hoặc đơn hàng");
        }
    }
}
