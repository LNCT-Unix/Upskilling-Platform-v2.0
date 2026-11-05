package com.aiupskillingplatform.dto.auth;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserResponse user
) {}
