package com.app.pis.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OriginRequest {

    @Size(max = 50, message = "Mã xuất xứ tối đa 50 ký tự")
    private String originID;

    @Size(max = 100, message = "Tên xuất xứ tối đa 100 ký tự")
    private String originName;
}
