package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by unique email address.
     *
     * @param email user email
     * @return Optional containing the user if found, or empty
     */
    Optional<User> findByEmail(String email);

    /**
     * Check whether a user with the given email exists.
     *
     * @param email user email
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Check whether a user with the given username exists.
     *
     * @param username username string
     * @return true if user exists, false otherwise
     */
    boolean existsByUsername(String username);

    /**
     * Find user by unique username.
     *
     * @param username username string
     * @return Optional containing the user if found, or empty
     */
    Optional<User> findByUsername(String username);
}
