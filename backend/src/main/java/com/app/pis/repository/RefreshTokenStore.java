package com.app.pis.repository;

import com.app.pis.entity.RefreshToken;
import java.util.Optional;

public interface RefreshTokenStore {
    void save(RefreshToken refreshToken);
    Optional<RefreshToken> findByToken(String token);
    void deleteByToken(String token);
    void deleteByUsername(String username);
}
