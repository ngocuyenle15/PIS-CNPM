package com.app.pis.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitRequest {

    @Size(max = 50, message = "Mã đơn vị tối đa 50 ký tự")
    private String unitID;

    @Size(max = 50, message = "Tên đơn vị tối đa 50 ký tự")
    private String unitName;
}
