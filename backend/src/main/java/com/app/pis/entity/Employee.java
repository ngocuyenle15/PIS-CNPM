package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Employee {

    @Id
    @Column(name = "employeeID", length = 50)
    private String employeeID;

    @Column(name = "fullName", length = 255, nullable = false)
    private String fullName;

    @Column(name = "phoneNumber", length = 15, unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "email", length = 150, unique = true, nullable = false)
    private String email;

    @Column(name = "gender", length = 10, nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "yearOfBirth", nullable = false)
    private Integer yearOfBirth;

    @Column(name = "hireDate", nullable = false)
    private LocalDate hireDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum Gender {
        Male, Female
    }
}
