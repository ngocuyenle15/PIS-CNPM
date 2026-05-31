package com.app.pis.dto;

import com.app.pis.entity.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequest {

    @Size(max = 150, message = "Tên đăng nhập tối đa 150 ký tự")
    private String username;

    private String password;

    private Role.RoleName roleName;

    private String employeeID;

    private Boolean isStaff;

    private Boolean isActive;
}
