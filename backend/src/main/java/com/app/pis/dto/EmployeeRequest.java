package com.app.pis.dto;

import com.app.pis.entity.Employee;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeRequest {

    @Size(max = 50, message = "Mã nhân viên tối đa 50 ký tự")
    private String employeeID;

    @Size(max = 255, message = "Họ tên tối đa 255 ký tự")
    private String fullName;

    @Pattern(regexp = "^[0-9]{9,15}$", message = "Số điện thoại không hợp lệ (từ 9 đến 15 chữ số)")
    private String phoneNumber;

//    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    @Size(max = 150, message = "Email tối đa 150 ký tự")
    private String email;

    private Employee.Gender gender;

    @Min(value = 1900, message = "Năm sinh không hợp lệ")
    private Integer yearOfBirth;

    private LocalDate hireDate;

    private Boolean isActive;
}
