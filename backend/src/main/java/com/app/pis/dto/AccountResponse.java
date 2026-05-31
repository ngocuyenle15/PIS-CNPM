package com.app.pis.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {
    private Integer accountID;
    private String username;
    private String role;
    private Boolean isStaff;
    private Boolean isActive;
    private Boolean isFirstLogin;
    private EmployeeInfo employee;
    private String generatedPassword;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmployeeInfo {
        private String employeeID;
        private String fullName;
        private String phoneNumber;
        private String email;
    }
}
