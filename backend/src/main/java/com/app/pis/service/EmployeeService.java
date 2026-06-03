package com.app.pis.service;

import com.app.pis.dto.EmployeeRequest;
import com.app.pis.dto.EmployeeWithAccountRequest;
import com.app.pis.dto.EmployeeWithAccountResponse;
import com.app.pis.dto.AccountRequest;
import com.app.pis.dto.AccountResponse;
import com.app.pis.entity.Employee;
import com.app.pis.repository.AccountRepository;
import com.app.pis.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;
    private final RefreshTokenService refreshTokenService;

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee getById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên với mã: " + id));
    }

    @Transactional
    public Employee create(EmployeeRequest request) {
        if (!StringUtils.hasText(request.getEmployeeID())) {
            throw new IllegalArgumentException("Mã nhân viên không được để trống");
        }
        if (!StringUtils.hasText(request.getFullName())) {
            throw new IllegalArgumentException("Họ tên nhân viên không được để trống");
        }
        if (!StringUtils.hasText(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Số điện thoại không được để trống");
        }
        if (!StringUtils.hasText(request.getEmail())) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        if (request.getGender() == null) {
            throw new IllegalArgumentException("Giới tính không được để trống");
        }
        if (request.getYearOfBirth() == null) {
            throw new IllegalArgumentException("Năm sinh không được để trống");
        }
        if (request.getHireDate() == null) {
            throw new IllegalArgumentException("Ngày vào làm không được để trống");
        }

        String employeeID = request.getEmployeeID().trim().toUpperCase();
        String phoneNumber = request.getPhoneNumber().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (employeeRepository.existsById(employeeID)) {
            throw new IllegalArgumentException("Mã nhân viên '" + employeeID + "' đã tồn tại");
        }

        if (employeeRepository.existsByPhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("Số điện thoại '" + phoneNumber + "' đã được sử dụng");
        }

        if (employeeRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email '" + email + "' đã được sử dụng");
        }

        Employee employee = new Employee();
        employee.setEmployeeID(employeeID);
        employee.setFullName(request.getFullName().trim());
        employee.setPhoneNumber(phoneNumber);
        employee.setEmail(email);
        employee.setGender(request.getGender());
        employee.setYearOfBirth(request.getYearOfBirth());
        employee.setHireDate(request.getHireDate());
        employee.setIsActive(true);

        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee patch(String id, EmployeeRequest request) {
        Employee employee = getById(id);

        if (StringUtils.hasText(request.getFullName())) {
            employee.setFullName(request.getFullName().trim());
        }

        if (StringUtils.hasText(request.getPhoneNumber())) {
            String newPhone = request.getPhoneNumber().trim();
            if (!newPhone.equals(employee.getPhoneNumber())) {
                if (employeeRepository.existsByPhoneNumber(newPhone)) {
                    throw new IllegalArgumentException("Số điện thoại '" + newPhone + "' đã được sử dụng");
                }
                employee.setPhoneNumber(newPhone);
            }
        }

        if (StringUtils.hasText(request.getEmail())) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (!newEmail.equals(employee.getEmail())) {
                if (employeeRepository.existsByEmail(newEmail)) {
                    throw new IllegalArgumentException("Email '" + newEmail + "' đã được sử dụng");
                }
                employee.setEmail(newEmail);
            }
        }

        if (request.getGender() != null) {
            employee.setGender(request.getGender());
        }

        if (request.getYearOfBirth() != null) {
            employee.setYearOfBirth(request.getYearOfBirth());
        }

        if (request.getHireDate() != null) {
            employee.setHireDate(request.getHireDate());
        }

        return employeeRepository.save(employee);
    }

    @Transactional
    public void delete(String id) {
        Employee employee = getById(id);

        // Thu hồi refresh token của tài khoản liên kết nếu có
        accountRepository.findByEmployee(employee).ifPresent(account -> {
            refreshTokenService.deleteByUsername(account.getUsername());
        });

        try {
            employeeRepository.delete(employee);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalArgumentException("Không thể xóa nhân viên này vì đã phát sinh lịch sử dữ liệu trong hệ thống");
        }
    }

    @Transactional
    public EmployeeWithAccountResponse createWithAccount(EmployeeWithAccountRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được rỗng");
        }

        EmployeeRequest empReq = EmployeeRequest.builder()
                .employeeID(request.getEmployeeID())
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .gender(request.getGender())
                .yearOfBirth(request.getYearOfBirth())
                .hireDate(request.getHireDate())
                .build();
        Employee employee = create(empReq);

        AccountRequest accReq = AccountRequest.builder()
                .username(request.getUsername())
                .employeeID(employee.getEmployeeID())
                .roleName(request.getRoleName())
                .isStaff(request.getIsStaff())
                .isActive(request.getIsActive())
                .build();
        AccountResponse account = accountService.create(accReq);

        return EmployeeWithAccountResponse.builder()
                .employee(employee)
                .account(account)
                .build();
    }
}
