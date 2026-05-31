package com.app.pis.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineUnitRequest {

    @NotBlank(message = "Mã đơn vị tính quy đổi không được để trống")
    private String unitID;

    @NotNull(message = "Tỷ lệ quy đổi không được để trống")
    @Min(value = 1, message = "Tỷ lệ quy đổi phải lớn hơn hoặc bằng 1")
    private Integer conversionRate;
}
