package com.app.pis.repository;

import com.app.pis.entity.RefreshToken;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @deprecated Đã thay thế bằng {@link DatabaseRefreshTokenStore}.
 * File này được giữ lại để tham khảo. Không được sử dụng trong production.
 */
// @Component — Đã loại bỏ, thay thế bằng DatabaseRefreshTokenStore
public class InMemoryRefreshTokenStore implements RefreshTokenStore {

    private final ConcurrentHashMap<String, RefreshToken> tokenMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> usernameToTokenMap = new ConcurrentHashMap<>();

    @Override
    public void save(RefreshToken refreshToken) {
        if (refreshToken.getUsername() != null) {
            deleteByUsername(refreshToken.getUsername());
        }
        tokenMap.put(refreshToken.getToken(), refreshToken);
        usernameToTokenMap.put(refreshToken.getUsername(), refreshToken.getToken());
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return Optional.ofNullable(tokenMap.get(token));
    }

    @Override
    public void deleteByToken(String token) {
        RefreshToken refreshToken = tokenMap.remove(token);
        if (refreshToken != null && refreshToken.getUsername() != null) {
            usernameToTokenMap.remove(refreshToken.getUsername());
        }
    }

    @Override
    public void deleteByUsername(String username) {
        String token = usernameToTokenMap.remove(username);
        if (token != null) {
            tokenMap.remove(token);
        }
    }
}
