package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Unit {

    @Id
    @Column(name = "unitID", length = 50)
    private String unitID;

    @Column(name = "unitName", length = 50, unique = true, nullable = false)
    private String unitName;
}
