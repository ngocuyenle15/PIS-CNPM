package com.app.pis.repository;

import com.app.pis.entity.RefreshToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Implementation lưu Refresh Token vào database thông qua JPA.
 * Đảm bảo refresh token tồn tại qua các lần restart backend.
 */
@Component
@RequiredArgsConstructor
public class DatabaseRefreshTokenStore implements RefreshTokenStore {

    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    @Transactional
    public void save(RefreshToken refreshToken) {
        // Xóa token cũ của user trước khi lưu token mới (rotation)
        if (refreshToken.getUsername() != null) {
            refreshTokenRepository.deleteByUsername(refreshToken.getUsername());
        }
        refreshTokenRepository.save(refreshToken);
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    @Override
    @Transactional
    public void deleteByUsername(String username) {
        refreshTokenRepository.deleteByUsername(username);
    }
}
