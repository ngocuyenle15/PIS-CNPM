package com.app.pis.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineResponse {
    private String medicineID;
    private String medicineName;
    private String image;
    private String ingredients;
    private BigDecimal unitPrice;

    private UnitInfo baseUnit;
    private CatalogInfo catalog;
    private OriginInfo origin;
    private List<AlternativeUnitInfo> alternativeUnits;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UnitInfo {
        private String unitID;
        private String unitName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CatalogInfo {
        private String catalogID;
        private String catalogName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OriginInfo {
        private String originID;
        private String originName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AlternativeUnitInfo {
        private String unitID;
        private String unitName;
        private Integer conversionRate;
    }
}
