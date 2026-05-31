package com.app.pis.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineRequest {

    @Size(max = 50, message = "Mã thuốc tối đa 50 ký tự")
    private String medicineID;

    @Size(max = 255, message = "Tên thuốc tối đa 255 ký tự")
    private String medicineName;

    @Size(max = 500, message = "Đường dẫn ảnh tối đa 500 ký tự")
    private String image;

    private String ingredients;

    private String unitID;

    private String catalogID;

    private String originID;

    @DecimalMin(value = "0.0", message = "Đơn giá không được nhỏ hơn 0")
    private BigDecimal unitPrice;

    private List<MedicineUnitRequest> alternativeUnits;
}
