package com.app.pis.dto;

import com.app.pis.entity.Customer;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerRequest {

    @Size(max = 50, message = "Mã khách hàng tối đa 50 ký tự")
    private String customerID;

    @Size(max = 100, message = "Họ tên khách hàng tối đa 100 ký tự")
    private String fullName;

    @Pattern(regexp = "^[0-9]{9,15}$", message = "Số điện thoại không hợp lệ (từ 9 đến 15 chữ số)")
    private String phoneNumber;

    private Customer.Gender gender;
}
