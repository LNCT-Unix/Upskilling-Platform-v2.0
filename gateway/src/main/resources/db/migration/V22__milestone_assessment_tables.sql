-- =========================================================================
-- Migration: Milestone Assessment Tables (Authoritative Schema)
-- Note: Prepared as a standalone deliverable because V13 Flyway conflict
--       (V13__add_github_id_to_users.sql vs
--        V13__roadmap_resources_programming_fundamentals.sql)
--       is currently unresolved (Case D). Assign final version number
--       after resolving V13 against flyway_schema_history.
-- =========================================================================

-- =========================================================================
-- Table 1: Master Question Bank (Skill-Based, JSONB options)
-- =========================================================================
CREATE TABLE IF NOT EXISTS milestone_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    node_id UUID REFERENCES roadmap_nodes(id) ON DELETE SET NULL, -- optional subtopic tag
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,             -- {"A": "A class", "B": "A contract", "C": "An object", "D": "A method"}
    correct_answer VARCHAR(1) NOT NULL, -- 'A', 'B', 'C', or 'D'
    explanation TEXT,
    difficulty VARCHAR(20) DEFAULT 'BEGINNER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- =========================================================================
-- Table 2: User Test Attempts (Per Skill)
-- =========================================================================
CREATE TABLE IF NOT EXISTS milestone_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    node_id UUID REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
    attempt_number INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'COMPLETED', 'ABANDONED'
    score INT,                                         -- 0 to 8 (computed on submission)
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE              -- filled when user submits
);

-- =========================================================================
-- Table 3: 8 Questions Assigned per Attempt
-- =========================================================================
CREATE TABLE IF NOT EXISTS milestone_attempt_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES milestone_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES milestone_questions(id) ON DELETE CASCADE,
    question_order INT NOT NULL,                       -- 1 to 8
    selected_answer VARCHAR(1),                        -- 'A', 'B', 'C', 'D' or NULL
    is_correct BOOLEAN                                 -- true/false (evaluated on submit)
);

-- =========================================================================
-- Indexes for Fast Query Performance
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_milestone_questions_skill ON milestone_questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_milestone_attempts_user_skill ON milestone_attempts(user_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_milestone_attempt_questions_attempt ON milestone_attempt_questions(attempt_id);
