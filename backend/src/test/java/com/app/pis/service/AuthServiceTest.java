package com.app.pis.service;

import com.app.pis.dto.*;
import com.app.pis.entity.*;
import com.app.pis.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private InvalidatedTokenRepository invalidatedTokenRepository;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private com.app.pis.config.JwtTokenProvider jwtTokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private MailService mailService;

    @InjectMocks
    private AuthService authService;

    private Account account;
    private Employee employee;
    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setRoleID(1);
        role.setRoleName(Role.RoleName.Admin);

        employee = new Employee();
        employee.setEmployeeID("EMP001");
        employee.setFullName("Test Admin");
        employee.setPhoneNumber("0123456789");
        employee.setEmail("admin@test.com");
        employee.setGender(Employee.Gender.Male);
        employee.setYearOfBirth(1990);
        employee.setIsActive(true);

        account = new Account();
        account.setAccountID(1);
        account.setUsername("admin");
        account.setPassword("$2a$10$encodedPassword");
        account.setEmployee(employee);
        account.setRole(role);
        account.setIsStaff(true);
        account.setIsActive(true);
        account.setIsFirstLogin(false);
    }

    // =========================================================================
    // TESTS FOR LOGIN
    // =========================================================================

    @Test
    void testLogin_Success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("admin123", account.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken("admin", "Admin")).thenReturn("access-token-123");

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("refresh-token-456");
        refreshToken.setUsername("admin");
        when(refreshTokenService.createRefreshToken("admin")).thenReturn(refreshToken);

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access-token-123", response.getAccessToken());
        assertEquals("refresh-token-456", response.getRefreshToken());
        assertEquals("admin", response.getUsername());
        assertEquals("Admin", response.getRole());
    }

    @Test
    void testLogin_WrongUsername_ThrowsBadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("password");

        when(accountRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> {
            authService.login(request);
        });
    }

    @Test
    void testLogin_WrongPassword_ThrowsBadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("wrongpassword");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("wrongpassword", account.getPassword())).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {
            authService.login(request);
        });
    }

    @Test
    void testLogin_InactiveAccount_ThrowsException() {
        account.setIsActive(false);

        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));

        assertThrows(IllegalArgumentException.class, () -> {
            authService.login(request);
        });
    }

    @Test
    void testLogin_FirstLogin_RequiresPasswordChange() {
        account.setIsFirstLogin(true);

        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("admin123", account.getPassword())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> {
            authService.login(request);
        });
    }

    // =========================================================================
    // TESTS FOR CHANGE PASSWORD
    // =========================================================================

    @Test
    void testChangePassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setUsername("admin");
        request.setOldPassword("admin123");
        request.setNewPassword("newpass123");
        request.setConfirmNewPassword("newpass123");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("admin123", account.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newpass123")).thenReturn("$2a$10$newEncodedPassword");
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        assertDoesNotThrow(() -> {
            authService.changePassword("admin", request);
        });

        assertFalse(account.getIsFirstLogin());
        verify(accountRepository).save(account);
    }

    @Test
    void testChangePassword_MismatchConfirm_ThrowsException() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setUsername("admin");
        request.setOldPassword("admin123");
        request.setNewPassword("newpass123");
        request.setConfirmNewPassword("differentpass");

        assertThrows(IllegalArgumentException.class, () -> {
            authService.changePassword("admin", request);
        });
    }

    @Test
    void testChangePassword_WrongOldPassword_ThrowsException() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setUsername("admin");
        request.setOldPassword("wrongOld");
        request.setNewPassword("newpass123");
        request.setConfirmNewPassword("newpass123");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("wrongOld", account.getPassword())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> {
            authService.changePassword("admin", request);
        });
    }

    // =========================================================================
    // TESTS FOR GET ME
    // =========================================================================

    @Test
    void testGetMe_Success() {
        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));

        UserMeResponse response = authService.getMe("admin");

        assertNotNull(response);
        assertEquals("admin", response.getUsername());
        assertEquals("Admin", response.getRole());
        assertTrue(response.getIsActive());
        assertNotNull(response.getEmployee());
        assertEquals("EMP001", response.getEmployee().getEmployeeID());
        assertEquals("Test Admin", response.getEmployee().getFullName());
    }

    @Test
    void testGetMe_NotFound_ThrowsException() {
        when(accountRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            authService.getMe("nonexistent");
        });
    }

    // =========================================================================
    // TESTS FOR FORGOT PASSWORD
    // =========================================================================

    @Test
    void testForgotPassword_Success() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setUsername("admin");
        request.setEmail("admin@test.com");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$tempEncoded");
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));
        doNothing().when(mailService).sendMail(anyString(), anyString(), anyString());

        String tempPassword = authService.forgotPassword(request);

        assertNotNull(tempPassword);
        assertEquals(8, tempPassword.length());
        assertTrue(account.getIsFirstLogin());
        verify(mailService).sendMail(eq("admin@test.com"), anyString(), anyString());
    }

    @Test
    void testForgotPassword_WrongEmail_ThrowsException() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setUsername("admin");
        request.setEmail("wrong@test.com");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));

        assertThrows(IllegalArgumentException.class, () -> {
            authService.forgotPassword(request);
        });
    }

    @Test
    void testForgotPassword_WrongUsername_ThrowsException() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setUsername("nonexistent");
        request.setEmail("admin@test.com");

        when(accountRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            authService.forgotPassword(request);
        });
    }

    // =========================================================================
    // TESTS FOR RESET PASSWORD (Admin only)
    // =========================================================================

    @Test
    void testResetPassword_Success() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setUsername("admin");
        request.setNewPassword("resetpass123");

        when(accountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.encode("resetpass123")).thenReturn("$2a$10$resetEncoded");
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        assertDoesNotThrow(() -> {
            authService.resetPassword(request);
        });

        verify(accountRepository).save(account);
    }
}
