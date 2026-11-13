/*
# Add quiz tables for lesson quizzes

## Summary
Adds quiz questions and quiz attempts tables so each lesson can have
multiple-choice quiz questions. Students answer quizzes after reading
a lesson and their attempts are saved.

## New Tables

1. `quiz_questions`
   - id (uuid, PK)
   - lesson_id (uuid, FK -> lessons.id ON DELETE CASCADE)
   - question (text) — the question text
   - choices (text[]) — array of answer choices
   - correct_index (int) — index into choices array (0-based)
   - sort_order (int)
   - created_at (timestamptz)

2. `quiz_attempts`
   - id (uuid, PK)
   - user_id (uuid, NOT NULL DEFAULT auth.uid(), FK -> auth.users ON DELETE CASCADE)
   - question_id (uuid, FK -> quiz_questions.id ON DELETE CASCADE)
   - selected_index (int) — the answer the student picked
   - is_correct (boolean)
   - attempted_at (timestamptz, default now())

## Security

- `quiz_questions`: SELECT public (anon + authenticated) so anyone can read questions.
  INSERT/UPDATE/DELETE restricted to authenticated (admin use).
- `quiz_attempts`: owner-scoped CRUD for authenticated users only.
- Grants match policy roles exactly.

## Seed Data
- Quiz questions for 7 existing lessons (variables, functions, loops, lists,
  what-is-ml, first-classifier, intro-dataframes) — 2 questions each for the
  Python for Beginners lessons and 1-2 for the others.
*/

-- ============ quiz_questions ============
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  choices text[] NOT NULL,
  correct_index int NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON quiz_questions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON quiz_questions TO authenticated;

DROP POLICY IF EXISTS "public_select_quiz_questions" ON quiz_questions;
CREATE POLICY "public_select_quiz_questions" ON quiz_questions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_quiz_questions" ON quiz_questions;
CREATE POLICY "auth_insert_quiz_questions" ON quiz_questions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_quiz_questions" ON quiz_questions;
CREATE POLICY "auth_update_quiz_questions" ON quiz_questions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_quiz_questions" ON quiz_questions;
CREATE POLICY "auth_delete_quiz_questions" ON quiz_questions FOR DELETE
  TO authenticated USING (true);

-- ============ quiz_attempts ============
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_index int NOT NULL,
  is_correct boolean NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON quiz_attempts TO authenticated;

DROP POLICY IF EXISTS "select_own_quiz_attempts" ON quiz_attempts;
CREATE POLICY "select_own_quiz_attempts" ON quiz_attempts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_quiz_attempts" ON quiz_attempts;
CREATE POLICY "insert_own_quiz_attempts" ON quiz_attempts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_quiz_attempts" ON quiz_attempts;
CREATE POLICY "update_own_quiz_attempts" ON quiz_attempts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_quiz_attempts" ON quiz_attempts;
CREATE POLICY "delete_own_quiz_attempts" ON quiz_attempts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ Indexes ============
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson_id ON quiz_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);

-- ============ Seed quiz questions ============
-- We reference lessons by (course_id, slug) via subqueries since IDs are fixed UUIDs from the first migration.

-- Lesson: Variables and Data Types (2 questions)
INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'What is the output of type(42) in Python?', 
  ARRAY['<class "str">', '<class "int">', '<class "float">', '<class "bool">'], 1, 1
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000001' AND slug = 'variables-and-data-types'
ON CONFLICT DO NOTHING;

INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'Which of these is NOT a built-in Python data type?',
  ARRAY['int', 'str', 'array', 'bool'], 2, 2
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000001' AND slug = 'variables-and-data-types'
ON CONFLICT DO NOTHING;

-- Lesson: Functions (2 questions)
INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'What keyword is used to define a function in Python?',
  ARRAY['func', 'def', 'function', 'define'], 1, 1
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000001' AND slug = 'functions'
ON CONFLICT DO NOTHING;

INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'What does a function return if there is no return statement?',
  ARRAY['0', 'null', 'None', 'Error'], 2, 2
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000001' AND slug = 'functions'
ON CONFLICT DO NOTHING;

-- Lesson: Loops and Conditionals (2 questions)
INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'What does range(5) generate?',
  ARRAY['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[0, 1, 2, 3, 4, 5]', '[5]'], 1, 1
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000001' AND slug = 'loops-and-conditionals'
ON CONFLICT DO NOTHING;

INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'Which keyword is used for the "otherwise" branch in a conditional?',
  ARRAY['else', 'elif', 'default', 'otherwise'], 0, 2
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000001' AND slug = 'loops-and-conditionals'
ON CONFLICT DO NOTHING;

-- Lesson: Lists and Dictionaries (2 questions)
INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'How do you access the first element of a list called fruits?',
  ARRAY['fruits[0]', 'fruits[1]', 'fruits.first', 'fruits(0)'], 0, 1
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000001' AND slug = 'lists-and-dictionaries'
ON CONFLICT DO NOTHING;

INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'In a dictionary, how do you access a value by its key?',
  ARRAY['dict.key', 'dict[key]', 'dict->key', 'dict(key)'], 1, 2
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000001' AND slug = 'lists-and-dictionaries'
ON CONFLICT DO NOTHING;

-- Lesson: What is Machine Learning? (1 question)
INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'In which type of ML does the model learn from labeled examples?',
  ARRAY['Unsupervised Learning', 'Supervised Learning', 'Reinforcement Learning', 'Transfer Learning'], 1, 1
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000002' AND slug = 'what-is-machine-learning'
ON CONFLICT DO NOTHING;

-- Lesson: Your First Classifier (1 question)
INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'What function is used to train a scikit-learn model?',
  ARRAY['model.train()', 'model.fit()', 'model.learn()', 'model.run()'], 1, 1
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000002' AND slug = 'your-first-classifier'
ON CONFLICT DO NOTHING;

-- Lesson: Introduction to DataFrames (1 question)
INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'What is the core 2D data structure in pandas called?',
  ARRAY['Series', 'DataFrame', 'Array', 'Table'], 1, 1
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000003' AND slug = 'introduction-to-dataframes'
ON CONFLICT DO NOTHING;

-- Lesson: Filtering and Sorting (1 question)
INSERT INTO quiz_questions (lesson_id, question, choices, correct_index, sort_order)
SELECT id, 'Which method sorts a DataFrame by a column?',
  ARRAY['df.order_by()', 'df.sort()', 'df.sort_values()', 'df.arrange()'], 2, 1
FROM lessons WHERE course_id = 'a0000000-0000-0000-0000-000000000003' AND slug = 'filtering-and-sorting'
ON CONFLICT DO NOTHING;
