package com.aiupskillingplatform.entities;

import com.aiupskillingplatform.enums.Role;
import com.aiupskillingplatform.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    private String passwordHash;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, length = 50)
    private String username;

    private String profilePictureUrl;

    private String bio;

    private String phoneNumber;

    private boolean emailVerified = false;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();

    private Instant deletedAt;
}