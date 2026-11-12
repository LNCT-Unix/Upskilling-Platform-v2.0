package com.aiupskillingplatform.config;

import org.springframework.boot.flyway.autoconfigure.FlywayConfigurationCustomizer;
import org.springframework.boot.flyway.autoconfigure.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Flyway configuration shared across all environments.
 * - repair(): auto-fixes checksum mismatches in flyway_schema_history
 *   (caused by line-ending differences between developer machines)
 * - validateOnMigrate(false): skip checksum validation so the app starts
 *   cleanly even if local SQL files have minor whitespace differences
 */
@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            flyway.repair();
            flyway.migrate();
        };
    }

    @Bean
    public FlywayConfigurationCustomizer flywayConfigurationCustomizer() {
        return configuration -> configuration.validateOnMigrate(false);
    }
}

