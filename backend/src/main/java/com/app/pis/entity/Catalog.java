package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicines_catalog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Catalog {

    @Id
    @Column(name = "catalogID", length = 50)
    private String catalogID;

    @Column(name = "catalogName", length = 100, unique = true, nullable = false)
    private String catalogName;
}
