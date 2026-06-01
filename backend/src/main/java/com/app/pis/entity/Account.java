package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"password"})
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accountID")
    private Integer accountID;

    @Column(name = "username", length = 150, unique = true, nullable = false)
    private String username;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    /**
     * Quan hệ 1-1 với Employee (nullable: một account có thể không gắn với nhân viên nào,
     * ví dụ superuser tạo tự động)
     */
    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employeeID", unique = true)
    private Employee employee;

    /**
     * Quan hệ N-1 với Role (mỗi account bắt buộc có một role)
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id", referencedColumnName = "roleID", nullable = false)
    private Role role;

    @Column(name = "is_staff", nullable = false)
    private Boolean isStaff = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_first_login", nullable = false)
    private Boolean isFirstLogin = true;
}
