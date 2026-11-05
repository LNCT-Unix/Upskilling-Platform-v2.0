

--TABLE 1

CREATE TABLE IF NOT EXISTS users (

    id UUID PRIMARY KEY,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255),

    full_name VARCHAR(255) NOT NULL,

    username VARCHAR(50) UNIQUE,

    profile_picture_url VARCHAR(255),

    bio VARCHAR(255),

    phone_number VARCHAR(255),

    email_verified BOOLEAN DEFAULT FALSE,

    status VARCHAR(255),

    created_at TIMESTAMPTZ,

    updated_at TIMESTAMPTZ,

    deleted_at TIMESTAMPTZ

);


-- TABLE 2

CREATE TABLE IF NOT EXISTS tracks (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,
    
    description TEXT,

    slug VARCHAR(100) NOT NULL UNIQUE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



-- TABLE 3

CREATE TABLE IF NOT EXISTS skill_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    slug VARCHAR(100) NOT NULL UNIQUE,

    sort_order INTEGER,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

-- TABLE 4

CREATE TABLE IF NOT EXISTS skills (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    track_id UUID NOT NULL,

    category_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,

    slug VARCHAR(150) NOT NULL UNIQUE,

    description TEXT,

    difficulty_level VARCHAR(20) NOT NULL,

    sort_order INTEGER,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_skills_track
        FOREIGN KEY (track_id)
        REFERENCES tracks(id),

    CONSTRAINT fk_skills_category
        FOREIGN KEY (category_id)
        REFERENCES skill_categories(id)

);


-- TABLE 5

CREATE TABLE IF NOT EXISTS skill_dependencies (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    prerequisite_skill_id UUID NOT NULL,

    dependent_skill_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    created_by UUID,

    CONSTRAINT fk_dependency_prerequisite
        FOREIGN KEY (prerequisite_skill_id)
        REFERENCES skills(id),

    CONSTRAINT fk_dependency_dependent
        FOREIGN KEY (dependent_skill_id)
        REFERENCES skills(id),

    CONSTRAINT fk_dependency_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id),

    CONSTRAINT uq_skill_dependency
        UNIQUE (prerequisite_skill_id, dependent_skill_id),

    CONSTRAINT chk_no_self_dependency
        CHECK (prerequisite_skill_id <> dependent_skill_id)

);


-- TABLE 6

CREATE TABLE IF NOT EXISTS questions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    question_text TEXT NOT NULL,

    question_type VARCHAR(30) NOT NULL,

    option_data JSONB,

    correct_answer VARCHAR(100) NOT NULL,

    explanation TEXT,

    difficulty VARCHAR(20) NOT NULL,

    difficulty_parameter NUMERIC(6,3) NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- TABLE 7: ASSESSMENT_ATTEMPTS

CREATE TABLE IF NOT EXISTS assessment_attempts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    track_id UUID NOT NULL,

    status VARCHAR(20) NOT NULL,

    total_questions INTEGER DEFAULT 0,

    answered_questions INTEGER DEFAULT 0,

    started_at TIMESTAMPTZ DEFAULT NOW(),

    completed_at TIMESTAMPTZ,

    CONSTRAINT fk_attempts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_attempts_track
        FOREIGN KEY (track_id)
        REFERENCES tracks(id),

    CONSTRAINT chk_attempt_question_counts
        CHECK (
            total_questions >= 0
            AND answered_questions >= 0
            AND answered_questions <= total_questions
        )

);


-- TABLE 8

CREATE TABLE IF NOT EXISTS assessment_responses (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attempt_id UUID NOT NULL,

    question_id UUID NOT NULL,

    question_order INTEGER NOT NULL,

    selected_answer VARCHAR(100),

    is_correct BOOLEAN,

    answered_at TIMESTAMPTZ,

    CONSTRAINT fk_responses_attempt
        FOREIGN KEY (attempt_id)
        REFERENCES assessment_attempts(id),

    CONSTRAINT fk_responses_question
        FOREIGN KEY (question_id)
        REFERENCES questions(id),

    CONSTRAINT uq_attempt_question
        UNIQUE (attempt_id, question_id),

    CONSTRAINT chk_question_order
        CHECK (question_order > 0)

);



-- TABLE 9

CREATE TABLE IF NOT EXISTS user_skill_mastery (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    skill_id UUID NOT NULL,

    status VARCHAR(50) DEFAULT 'LOCKED',

    mastery_score NUMERIC(8,4) DEFAULT 0,

    last_assessed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_mastery_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_mastery_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id),

    CONSTRAINT uq_user_skill_mastery
        UNIQUE (user_id, skill_id)

);

--TABLE 10

CREATE TABLE IF NOT EXISTS question_skills (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    question_id UUID NOT NULL,

    skill_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_question_skills_question
        FOREIGN KEY (question_id)
        REFERENCES questions(id),

    CONSTRAINT fk_question_skills_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id),

    CONSTRAINT uq_question_skill
        UNIQUE (question_id, skill_id)

);


-- INDEXES
-- it helps in the foreign-key lookup and makes retrieval performance better


CREATE INDEX IF NOT EXISTS idx_skills_track
    ON skills(track_id);

CREATE INDEX IF NOT EXISTS idx_skills_category
    ON skills(category_id);

CREATE INDEX IF NOT EXISTS idx_dependency_prerequisite
    ON skill_dependencies(prerequisite_skill_id);

CREATE INDEX IF NOT EXISTS idx_dependency_dependent
    ON skill_dependencies(dependent_skill_id);

CREATE INDEX IF NOT EXISTS idx_attempts_user
    ON assessment_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_attempts_track
    ON assessment_attempts(track_id);

CREATE INDEX IF NOT EXISTS idx_responses_attempt
    ON assessment_responses(attempt_id);

CREATE INDEX IF NOT EXISTS idx_responses_question
    ON assessment_responses(question_id);

CREATE INDEX IF NOT EXISTS idx_mastery_user
    ON user_skill_mastery(user_id);

CREATE INDEX IF NOT EXISTS idx_mastery_skill
    ON user_skill_mastery(skill_id);



