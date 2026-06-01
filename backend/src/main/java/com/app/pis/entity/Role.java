package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roleID")
    private Integer roleID;

    @Column(name = "roleName", length = 50, unique = true, nullable = false)
    @Enumerated(EnumType.STRING)
    private RoleName roleName;

    public enum RoleName {
        Admin,
        Sales,
        Product_manager
    }
}
