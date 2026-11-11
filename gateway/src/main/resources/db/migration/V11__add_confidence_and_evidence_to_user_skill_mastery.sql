-- Add confidence_score and evidence_count columns expected by UserSkillMastery entity
ALTER TABLE user_skill_mastery
    ADD COLUMN IF NOT EXISTS confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS evidence_count INTEGER NOT NULL DEFAULT 0;

