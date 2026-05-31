package com.app.pis.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "authentication_invalidated_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvalidatedToken {

    @Id
    @Column(name = "token_id", length = 500)
    private String id;

    @Column(name = "expiry_time", nullable = false)
    private Instant expiryTime;
}
