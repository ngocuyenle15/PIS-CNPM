package com.app.pis.dto;

import com.app.pis.entity.Employee;
import com.app.pis.entity.Role;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeWithAccountRequest {

    // Employee fields
    @NotBlank(message = "Mã nhân viên không được để trống")
    @Size(max = 50, message = "Mã nhân viên tối đa 50 ký tự")
    private String employeeID;

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 255, message = "Họ tên tối đa 255 ký tự")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{9,15}$", message = "Số điện thoại không hợp lệ (từ 9 đến 15 chữ số)")
    private String phoneNumber;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    @Size(max = 150, message = "Email tối đa 150 ký tự")
    private String email;

    @NotNull(message = "Giới tính không được để trống")
    private Employee.Gender gender;

    @NotNull(message = "Năm sinh không được để trống")
    @Min(value = 1900, message = "Năm sinh không hợp lệ")
    private Integer yearOfBirth;

    @NotNull(message = "Ngày vào làm không được để trống")
    private LocalDate hireDate;

    // Account fields
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(max = 150, message = "Tên đăng nhập tối đa 150 ký tự")
    private String username;

    @NotNull(message = "Vai trò không được để trống")
    private Role.RoleName roleName;

    private Boolean isStaff;
    private Boolean isActive;
}
