package com.app.pis.entity;

import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RefreshToken {
    private String token;
    private String username;
    private Instant expiryDate;
}
