package com.app.pis.service;

import com.app.pis.config.JwtTokenProvider;
import com.app.pis.dto.*;
import com.app.pis.entity.Account;
import com.app.pis.entity.Employee;
import com.app.pis.entity.InvalidatedToken;
import com.app.pis.entity.RefreshToken;
import com.app.pis.repository.AccountRepository;
import com.app.pis.repository.InvalidatedTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AccountRepository accountRepository;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (!account.getIsActive()) {
            throw new IllegalArgumentException("Tài khoản của bạn đã bị vô hiệu hóa");
        }

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new BadCredentialsException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        if (Boolean.TRUE.equals(account.getIsFirstLogin())) {
            throw new IllegalArgumentException("Yêu cầu đổi mật khẩu trong lần đăng nhập đầu tiên");
        }

        String roleName = account.getRole().getRoleName().name();
        String accessToken = jwtTokenProvider.generateAccessToken(account.getUsername(), roleName);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(account.getUsername());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .username(account.getUsername())
                .role(roleName)
                .isFirstLogin(account.getIsFirstLogin())
//                .message("Đăng nhập thành công")
                .build();
    }

    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        RefreshToken token = refreshTokenService.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Refresh Token không tồn tại hoặc không hợp lệ"));

        refreshTokenService.verifyExpiration(token);

        Account account = accountRepository.findByUsername(token.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản tương ứng với Refresh Token"));

        if (!account.getIsActive()) {
            throw new IllegalArgumentException("Tài khoản đã bị vô hiệu hóa");
        }

        // Generate new Access Token
        String roleName = account.getRole().getRoleName().name();
        String newAccessToken = jwtTokenProvider.generateAccessToken(account.getUsername(), roleName);

        // Recreate Refresh Token for security rotation
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(account.getUsername());

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .build();
    }

    @Transactional
    public void logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Token Authorization không đúng định dạng");
        }

        String token = authHeader.substring(7);
        if (jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsernameFromToken(token);
            Date expiryDate = jwtTokenProvider.getExpirationFromToken(token);

            // Blacklist the access token
            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(token)
                    .expiryTime(expiryDate.toInstant())
                    .build();
            invalidatedTokenRepository.save(invalidatedToken);

            // Remove refresh token from storage
            refreshTokenService.deleteByUsername(username);
            log.info("Người dùng '{}' đã đăng xuất thành công. Đã vô hiệu hóa token.", username);
        } else {
            try {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                refreshTokenService.deleteByUsername(username);
            } catch (Exception e) {
                // Ignore parsing errors for invalid token logs
            }
        }
    }

    public UserMeResponse getMe(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản hiện tại"));

        Employee emp = account.getEmployee();
        UserMeResponse.EmployeeInfo empInfo = null;

        if (emp != null) {
            empInfo = UserMeResponse.EmployeeInfo.builder()
                    .employeeID(emp.getEmployeeID())
                    .fullName(emp.getFullName())
                    .phoneNumber(emp.getPhoneNumber())
                    .email(emp.getEmail())
                    .gender(emp.getGender().name())
                    .yearOfBirth(emp.getYearOfBirth())
                    .hireDate(emp.getHireDate())
                    .isActive(emp.getIsActive())
                    .build();
        }

        return UserMeResponse.builder()
                .username(account.getUsername())
                .role(account.getRole().getRoleName().name())
                .isActive(account.getIsActive())
                .employee(empInfo)
                .build();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản cần đặt lại mật khẩu"));

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
        log.info("Admin đã đặt lại mật khẩu cho tài khoản: {}", request.getUsername());
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("Mật khẩu mới và mật khẩu xác nhận không khớp");
        }

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản hiện tại"));

        if (!passwordEncoder.matches(request.getOldPassword(), account.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        account.setIsFirstLogin(false);
        accountRepository.save(account);
        log.info("Tài khoản '{}' đã đổi mật khẩu thành công và cập nhật isFirstLogin = false", username);
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim();

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Tên đăng nhập hoặc email không chính xác"));

        Employee employee = account.getEmployee();
        if (employee == null || !employee.getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Tên đăng nhập hoặc email không chính xác");
        }

        String tempPassword = generateRandom8CharPassword();
        account.setPassword(passwordEncoder.encode(tempPassword));
        account.setIsFirstLogin(true);
        accountRepository.save(account);

        // TODO: Triển khai gửi mail sau
        mailService.sendMail(employee.getEmail(), "Hệ thống PIS", String.format(
                """
                Tài khoản đăng nhập của bạn là:
                username: %s
                Password: %s
                Vui lòng đổi mật khẩu sau khi đăng nhập!
                """, username, tempPassword));

        log.info("Đã sinh mật khẩu tạm thời cho tài khoản '{}'. Mật khẩu tạm: {}", username, tempPassword);

        return tempPassword;
    }

    private String generateRandom8CharPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        java.security.SecureRandom random = new java.security.SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
