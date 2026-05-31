package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicine_unit_conversion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MedicineUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "medicine_id", referencedColumnName = "medicineID", nullable = false)
    private Medicine medicine;

    @ManyToOne
    @JoinColumn(name = "unit_id", referencedColumnName = "unitID", nullable = false)
    private Unit unit;

    private Integer conversionRate;

}
