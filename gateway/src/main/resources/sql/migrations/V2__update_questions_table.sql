-- 1. Create the junction table if it does not already exist
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

-- 2. Transfer existing question-skill relationships
INSERT INTO question_skills (question_id, skill_id)
SELECT id, skill_id
FROM questions
WHERE skill_id IS NOT NULL
ON CONFLICT (question_id, skill_id) DO NOTHING;

-- 3. Remove the old foreign-key constraint
ALTER TABLE questions
DROP CONSTRAINT IF EXISTS fk_questions_skill;

-- 4. Remove the old discrimination constraint
ALTER TABLE questions
DROP CONSTRAINT IF EXISTS chk_question_discrimination;

-- 5. Remove the old columns
ALTER TABLE questions
DROP COLUMN IF EXISTS skill_id;

ALTER TABLE questions
DROP COLUMN IF EXISTS discrimination;