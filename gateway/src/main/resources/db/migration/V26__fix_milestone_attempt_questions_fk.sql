-- Fix foreign key on milestone_attempt_questions.question_id to reference milestone_questions(id)
-- (Hibernate ddl-auto=update previously created it pointing to questions(id)).

DELETE FROM milestone_attempt_questions
WHERE question_id NOT IN (SELECT id FROM milestone_questions);

ALTER TABLE milestone_attempt_questions
    DROP CONSTRAINT IF EXISTS milestone_attempt_questions_question_id_fkey;

ALTER TABLE milestone_attempt_questions
    ADD CONSTRAINT milestone_attempt_questions_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES milestone_questions(id) ON DELETE CASCADE;
