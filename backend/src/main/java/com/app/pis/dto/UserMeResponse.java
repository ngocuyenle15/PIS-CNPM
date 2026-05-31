package com.app.pis.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMeResponse {
    private String username;
    private String role;
    private Boolean isActive;
    private EmployeeInfo employee;

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
        private String gender;
        private Integer yearOfBirth;
        private LocalDate hireDate;
        private Boolean isActive;
    }
}
