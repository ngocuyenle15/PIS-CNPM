package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Customer {

    @Id
    @Column(name = "customerID", length = 50)
    private String customerID;

    @Column(name = "fullName", length = 100, nullable = false)
    private String fullName;

    @Column(name = "phoneNumber", length = 15, unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "gender", length = 10, nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @CreationTimestamp
    @Column(name = "joinDate", nullable = false, updatable = false)
    private LocalDate joinDate;

    public enum Gender {
        Male, Female
    }
}
