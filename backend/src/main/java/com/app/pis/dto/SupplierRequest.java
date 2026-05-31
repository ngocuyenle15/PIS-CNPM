package com.app.pis.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierRequest {

    @Size(max = 50, message = "Mã nhà cung cấp tối đa 50 ký tự")
    private String supplierID;

    @Size(max = 255, message = "Tên nhà cung cấp tối đa 255 ký tự")
    private String supplierName;

    @Pattern(regexp = "^[0-9]{9,15}$", message = "Số điện thoại không hợp lệ (từ 9 đến 15 chữ số)")
    private String phoneNumber;

    private String address;
}
