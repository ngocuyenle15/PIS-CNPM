package com.app.pis.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogRequest {

    @Size(max = 50, message = "Mã danh mục tối đa 50 ký tự")
    private String catalogID;

    @Size(max = 100, message = "Tên danh mục tối đa 100 ký tự")
    private String catalogName;
}
