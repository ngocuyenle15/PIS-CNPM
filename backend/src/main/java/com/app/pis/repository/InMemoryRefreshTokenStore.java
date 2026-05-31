package com.app.pis.repository;

import com.app.pis.entity.RefreshToken;
import org.springframework.stereotype.Component;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryRefreshTokenStore implements RefreshTokenStore {

    private final ConcurrentHashMap<String, RefreshToken> tokenMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> usernameToTokenMap = new ConcurrentHashMap<>();

    @Override
    public void save(RefreshToken refreshToken) {
        // If a refresh token already exists for the user, delete the old one
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
