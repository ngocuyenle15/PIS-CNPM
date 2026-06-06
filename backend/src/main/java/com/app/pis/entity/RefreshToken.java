package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_token", indexes = {
    @Index(name = "idx_refresh_token_username", columnList = "username"),
    @Index(name = "idx_refresh_token_expiry", columnList = "expiry_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false, unique = true, length = 255)
    private String token;

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;
}
