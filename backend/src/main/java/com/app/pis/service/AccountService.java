package com.app.pis.service;

import com.app.pis.dto.AccountRequest;
import com.app.pis.dto.AccountResponse;
import com.app.pis.entity.Account;
import com.app.pis.entity.Employee;
import com.app.pis.entity.Role;
import com.app.pis.repository.AccountRepository;
import com.app.pis.repository.EmployeeRepository;
import com.app.pis.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    public List<AccountResponse> getAll() {
        return accountRepository.findAll().stream()
                .map(acc -> convertToResponse(acc, null))
                .collect(Collectors.toList());
    }

    public AccountResponse getById(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với ID: " + id));
        return convertToResponse(account, null);
    }

    @Transactional
    public AccountResponse create(AccountRequest request) {
        if (!StringUtils.hasText(request.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập không được để trống");
        }
        if (!StringUtils.hasText(request.getEmployeeID())) {
            throw new IllegalArgumentException("Mã nhân viên liên kết không được để trống");
        }
        if (request.getRoleName() == null) {
            throw new IllegalArgumentException("Vai trò không được để trống");
        }

        String username = request.getUsername().trim();
        if (accountRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Tên đăng nhập '" + username + "' đã được sử dụng");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeID())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên với mã: " + request.getEmployeeID()));

        if (accountRepository.existsByEmployee(employee)) {
            throw new IllegalArgumentException("Nhân viên '" + employee.getFullName() + "' đã được liên kết với một tài khoản khác");
        }
        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò tương ứng với: " + request.getRoleName()));
        // Generate random secure password
        String plainPassword = generateRandomPassword();
        String encodedPassword = passwordEncoder.encode(plainPassword);

        Account account = new Account();
        account.setUsername(username);
        account.setPassword(encodedPassword);
        account.setEmployee(employee);
        account.setRole(role);
        account.setIsStaff(request.getIsStaff() != null ? request.getIsStaff() : false);
        account.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        Account savedAccount = accountRepository.save(account);

        // TODO: mail tự triển khai sau (Gửi email mật khẩu tự sinh đến nhân viên)
        mailService.sendMail(employee.getEmail(), "Hệ thống PIS", String.format(
                """
                Tài khoản đăng nhập của bạn là:
                username: %s
                Password: %s
                Vui lòng đổi mật khẩu sau khi đăng nhập!
                """, username, plainPassword));
        log.info("Đã tự động sinh mật khẩu cho tài khoản '{}'. Mật khẩu: {}", username, plainPassword);
        return convertToResponse(savedAccount, plainPassword);
    }

    @Transactional
    public AccountResponse patch(Integer id, AccountRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với ID: " + id));

        if (StringUtils.hasText(request.getUsername())) {
            String newUsername = request.getUsername().trim();
            if (!newUsername.equals(account.getUsername())) {
                if (accountRepository.existsByUsername(newUsername)) {
                    throw new IllegalArgumentException("Tên đăng nhập '" + newUsername + "' đã được sử dụng");
                }
                account.setUsername(newUsername);
            }
        }

        if (StringUtils.hasText(request.getPassword())) {
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            log.info("Đã cập nhật mật khẩu thủ công cho tài khoản '{}'", account.getUsername());
        }

        if (request.getRoleName() != null) {
            Role role = roleRepository.findByRoleName(request.getRoleName())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò tương ứng với: " + request.getRoleName()));
            account.setRole(role);
        }

        if (StringUtils.hasText(request.getEmployeeID())) {
            Employee employee = employeeRepository.findById(request.getEmployeeID())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên với mã: " + request.getEmployeeID()));

            if (account.getEmployee() == null || !employee.getEmployeeID().equals(account.getEmployee().getEmployeeID())) {
                if (accountRepository.existsByEmployee(employee)) {
                    throw new IllegalArgumentException("Nhân viên '" + employee.getFullName() + "' đã được liên kết với một tài khoản khác");
                }
                account.setEmployee(employee);
            }
        }

        if (request.getIsStaff() != null) {
            account.setIsStaff(request.getIsStaff());
        }

        if (request.getIsActive() != null) {
            account.setIsActive(request.getIsActive());
            // Sync status to the associated employee
            if (account.getEmployee() != null) {
                account.getEmployee().setIsActive(request.getIsActive());
                employeeRepository.save(account.getEmployee());
            }
            if (!request.getIsActive()) {
                refreshTokenService.deleteByUsername(account.getUsername());
            }
        }

        Account savedAccount = accountRepository.save(account);
        return convertToResponse(savedAccount, null);
    }

    @Transactional
    public void delete(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với ID: " + id));

        // Revoke active sessions / refresh tokens
        refreshTokenService.deleteByUsername(account.getUsername());
        
        account.setIsActive(false);
        accountRepository.save(account);

        // Sync status to the associated employee
        if (account.getEmployee() != null) {
            account.getEmployee().setIsActive(false);
            employeeRepository.save(account.getEmployee());
        }
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private AccountResponse convertToResponse(Account account, String plainPassword) {
        AccountResponse.EmployeeInfo empInfo = null;
        if (account.getEmployee() != null) {
            empInfo = AccountResponse.EmployeeInfo.builder()
                    .employeeID(account.getEmployee().getEmployeeID())
                    .fullName(account.getEmployee().getFullName())
                    .phoneNumber(account.getEmployee().getPhoneNumber())
                    .email(account.getEmployee().getEmail())
                    .build();
        }

        return AccountResponse.builder()
                .accountID(account.getAccountID())
                .username(account.getUsername())
                .role(account.getRole().getRoleName().name())
                .isStaff(account.getIsStaff())
                .isActive(account.getIsActive())
                .isFirstLogin(account.getIsFirstLogin())
                .employee(empInfo)
                .generatedPassword(plainPassword)
                .build();
    }
}
