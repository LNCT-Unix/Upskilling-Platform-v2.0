-- Resequenced from V13 to V21 to resolve duplicate V13 Flyway conflict
-- while preserving V13..V19 roadmap resource execution order.
-- Made idempotent because users.github_id + UNIQUE constraint already exist on Neon.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS github_id VARCHAR(255);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'users'
          AND tc.constraint_type = 'UNIQUE'
          AND kcu.column_name = 'github_id'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_github_id_key UNIQUE (github_id);
    END IF;
END $$;
