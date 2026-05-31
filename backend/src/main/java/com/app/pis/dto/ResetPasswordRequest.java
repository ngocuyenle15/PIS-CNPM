package com.app.pis.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordRequest {

    @NotBlank(message = "Username cần đặt lại mật khẩu không được để trống")
    private String username;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String newPassword;
}
