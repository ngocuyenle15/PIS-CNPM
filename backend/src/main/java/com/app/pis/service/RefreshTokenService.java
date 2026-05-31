package com.app.pis.service;

import com.app.pis.entity.RefreshToken;
import com.app.pis.repository.RefreshTokenStore;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.jwt.refresh-expiration-ms:604800000}") // 7 days default (7 * 24 * 60 * 60 * 1000)
    private long refreshExpirationMs;

    private final RefreshTokenStore refreshTokenStore;

    public RefreshToken createRefreshToken(String username) {
        RefreshToken refreshToken = RefreshToken.builder()
                .username(username)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshExpirationMs))
                .build();

        refreshTokenStore.save(refreshToken);
        return refreshToken;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenStore.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenStore.deleteByToken(token.getToken());
            throw new IllegalArgumentException("Refresh Token đã hết hạn. Vui lòng đăng nhập lại.");
        }
        return token;
    }

    public void deleteByToken(String token) {
        refreshTokenStore.deleteByToken(token);
    }

    public void deleteByUsername(String username) {
        refreshTokenStore.deleteByUsername(username);
    }
}
