package com.aiupskillingplatform.dto.auth;

import com.aiupskillingplatform.enums.Role;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        String username,
        Role role
) {}
