/*
# Create CSLearn platform tables (courses, lessons, enrollments, lesson progress)

## Summary
This migration sets up the core schema for a free CS learning platform.
Students sign up, browse free courses, enroll, read lessons, and track progress.

## New Tables

1. `courses`
   - id (uuid, PK)
   - title (text) — course name
   - slug (text, unique) — URL-friendly identifier
   - description (text) — short summary
   - category (text) — Python | AI | Data
   - level (text) — Beginner | Intermediate | Advanced
   - icon_name (text) — lucide icon name for display
   - cover_image (text) — optional image URL
   - instructor (text) — instructor name
   - sort_order (int) — display ordering
   - is_published (boolean, default true)
   - created_at (timestamptz)

2. `lessons`
   - id (uuid, PK)
   - course_id (uuid, FK -> courses.id ON DELETE CASCADE)
   - title (text)
   - slug (text) — URL-friendly identifier
   - content (text) — lesson body (markdown-like structured text)
   - code_example (text) — optional Python code block
   - code_language (text, default 'python')
   - sort_order (int) — lesson ordering within course
   - duration_min (int) — estimated minutes
   - created_at (timestamptz)

3. `enrollments`
   - id (uuid, PK)
   - user_id (uuid, NOT NULL DEFAULT auth.uid(), FK -> auth.users ON DELETE CASCADE)
   - course_id (uuid, FK -> courses.id ON DELETE CASCADE)
   - enrolled_at (timestamptz, default now())
   - UNIQUE(user_id, course_id)

4. `lesson_progress`
   - id (uuid, PK)
   - user_id (uuid, NOT NULL DEFAULT auth.uid(), FK -> auth.users ON DELETE CASCADE)
   - lesson_id (uuid, FK -> lessons.id ON DELETE CASCADE)
   - completed (boolean, default false)
   - completed_at (timestamptz, nullable)
   - UNIQUE(user_id, lesson_id)

## Security

- RLS enabled on ALL tables.
- `courses` and `lessons`: SELECT is public (anon + authenticated) so anyone can browse.
  INSERT/UPDATE/DELETE restricted to authenticated (for admin use — in this app all courses are pre-seeded).
- `enrollments`: owner-scoped CRUD for authenticated users only.
- `lesson_progress`: owner-scoped CRUD for authenticated users only.
- Grants match policy roles exactly.

## Notes
- All courses are free — no payment tables.
- Owner columns default to auth.uid() so frontend inserts omitting user_id still pass RLS.
- Seed data for 3 courses with real lessons is inserted at the end.
*/

-- ============ courses ============
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'Python',
  level text NOT NULL DEFAULT 'Beginner',
  icon_name text NOT NULL DEFAULT 'Code2',
  cover_image text,
  instructor text NOT NULL DEFAULT 'CSLearn Team',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON courses TO authenticated;

DROP POLICY IF EXISTS "public_select_courses" ON courses;
CREATE POLICY "public_select_courses" ON courses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_courses" ON courses;
CREATE POLICY "auth_insert_courses" ON courses FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_courses" ON courses;
CREATE POLICY "auth_update_courses" ON courses FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_courses" ON courses;
CREATE POLICY "auth_delete_courses" ON courses FOR DELETE
  TO authenticated USING (true);

-- ============ lessons ============
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  content text NOT NULL DEFAULT '',
  code_example text,
  code_language text NOT NULL DEFAULT 'python',
  sort_order int NOT NULL DEFAULT 0,
  duration_min int NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, slug)
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON lessons TO authenticated;

DROP POLICY IF EXISTS "public_select_lessons" ON lessons;
CREATE POLICY "public_select_lessons" ON lessons FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_lessons" ON lessons;
CREATE POLICY "auth_insert_lessons" ON lessons FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_lessons" ON lessons;
CREATE POLICY "auth_update_lessons" ON lessons FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_lessons" ON lessons;
CREATE POLICY "auth_delete_lessons" ON lessons FOR DELETE
  TO authenticated USING (true);

-- ============ enrollments ============
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON enrollments TO authenticated;

DROP POLICY IF EXISTS "select_own_enrollments" ON enrollments;
CREATE POLICY "select_own_enrollments" ON enrollments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_enrollments" ON enrollments;
CREATE POLICY "insert_own_enrollments" ON enrollments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_enrollments" ON enrollments;
CREATE POLICY "delete_own_enrollments" ON enrollments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ lesson_progress ============
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON lesson_progress TO authenticated;

DROP POLICY IF EXISTS "select_own_progress" ON lesson_progress;
CREATE POLICY "select_own_progress" ON lesson_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON lesson_progress;
CREATE POLICY "insert_own_progress" ON lesson_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON lesson_progress;
CREATE POLICY "update_own_progress" ON lesson_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON lesson_progress;
CREATE POLICY "delete_own_progress" ON lesson_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ Indexes ============
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- ============ Seed Data ============
-- Course 1: Python for Beginners
INSERT INTO courses (id, title, slug, description, category, level, icon_name, cover_image, instructor, sort_order)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Python for Beginners',
  'python-for-beginners',
  'Learn Python from scratch. Variables, data types, functions, loops, and your first real program.',
  'Python',
  'Beginner',
  'Code2',
  'https://images.pexels.com/photos/1102797/pexels-photo-1102797.png?auto=compress&cs=tinysrgb&h=400&w=600',
  'Dr. Sarah Chen',
  1
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000001',
 'Variables and Data Types',
 'variables-and-data-types',
 'In Python, a variable is a name that points to a value. You do not need to declare the type — Python figures it out automatically.\n\nPython has several built-in data types:\n- int — whole numbers (42)\n- float — decimal numbers (3.14)\n- str — text ("hello")\n- bool — True or False\n- list — ordered collection [1, 2, 3]\n\nYou can check the type of any value using the type() function.',
 '# Creating variables\nname = \"Alice\"\nage = 20\nheight = 5.6\nis_student = True\n\n# Check types\nprint(type(name))    # <class ''str''>\nprint(type(age))     # <class ''int''>\nprint(type(height))  # <class ''float''>\nprint(type(is_student))  # <class ''bool''>',
 1, 15)
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000001',
 'Functions',
 'functions',
 'A function is a reusable block of code that performs a specific task. You define it with the def keyword.\n\nFunctions can take arguments (inputs) and return a value (output). If no return is specified, the function returns None.\n\nFunctions help you avoid repeating code and make your programs easier to read and maintain.',
 '# Define a function\ndef greet(name):\n    return f\"Hello, {name}!\"\n\n# Call the function\nmessage = greet(\"Alice\")\nprint(message)  # Hello, Alice!\n\n# Function with default argument\ndef power(base, exponent=2):\n    return base ** exponent\n\nprint(power(3))      # 9 (3^2)\nprint(power(2, 5))   # 32 (2^5)',
 2, 20)
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000001',
 'Loops and Conditionals',
 'loops-and-conditionals',
 'Loops let you repeat code. Conditionals let your program make decisions.\n\n- if / elif / else — run code based on conditions\n- for loop — iterate over a sequence (list, string, range)\n- while loop — repeat while a condition is True\n\nThe range(n) function generates numbers from 0 to n-1.',
 '# If-elif-else\nscore = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"\nprint(f\"Grade: {grade}\")  # Grade: B\n\n# For loop\nfor i in range(5):\n    print(f\"Iteration {i}\")\n\n# While loop\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1',
 3, 20)
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000001',
 'Lists and Dictionaries',
 'lists-and-dictionaries',
 'Lists and dictionaries are two of the most useful data structures in Python.\n\n- Lists store ordered items in square brackets. You can add, remove, and access items by index.\n- Dictionaries store key-value pairs in curly braces. You access values by their key.\n\nBoth are mutable — you can change them after creation.',
 '# Lists\nfruits = [\"apple\", \"banana\", \"cherry\"]\nfruits.append(\"date\")\nprint(fruits[0])  # apple\nprint(len(fruits))  # 4\n\n# Dictionaries\nstudent = {\n    \"name\": \"Alice\",\n    \"age\": 20,\n    \"courses\": [\"Python\", \"ML\"]\n}\nprint(student[\"name\"])  # Alice\nstudent[\"age\"] = 21  # Update value',
 4, 25)
ON CONFLICT (course_id, slug) DO NOTHING;

-- Course 2: Intro to Machine Learning
INSERT INTO courses (id, title, slug, description, category, level, icon_name, cover_image, instructor, sort_order)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Intro to Machine Learning',
  'intro-to-machine-learning',
  'Understand what ML is, how models learn, and build your first classifier with scikit-learn.',
  'AI',
  'Intermediate',
  'Brain',
  'https://images.pexels.com/photos/17483867/pexels-photo-17483867.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  'Dr. Anika Patel',
  2
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000002',
 'What is Machine Learning?',
 'what-is-machine-learning',
 'Machine Learning is a branch of AI where computers learn patterns from data instead of being explicitly programmed.\n\nThere are three main types:\n- Supervised Learning — learn from labeled examples (spam detection, price prediction)\n- Unsupervised Learning — find patterns in unlabeled data (clustering)\n- Reinforcement Learning — learn by trial and error with rewards\n\nIn this course we focus on supervised learning, the most common type in practice.',
 '# The core idea of ML\n# Instead of writing rules by hand:\n#   if email contains "viagra": spam = True\n# We let the model learn rules from data:\n#   model.fit(emails, labels)  -> learns patterns automatically\n\nprint("ML = learning patterns from data, not writing rules by hand")',
 1, 15)
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000002',
 'Your First Classifier',
 'your-first-classifier',
 'Let us build a real classifier using scikit-learn. We will use the famous Iris dataset — predicting flower species from petal and sepal measurements.\n\nSteps:\n1. Load the data\n2. Split into training and testing sets\n3. Create a model (KNN — K-Nearest Neighbors)\n4. Train the model\n5. Evaluate accuracy\n\nThis is the exact workflow used in real ML projects.',
 'from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\n\n# 1. Load data\niris = load_iris()\nX, y = iris.data, iris.target\n\n# 2. Split: 80% train, 20% test\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\n# 3. Create model\nmodel = KNeighborsClassifier(n_neighbors=3)\n\n# 4. Train\nmodel.fit(X_train, y_train)\n\n# 5. Evaluate\npredictions = model.predict(X_test)\naccuracy = accuracy_score(y_test, predictions)\nprint(f"Accuracy: {accuracy:.2%}")  # ~100%',
 2, 30)
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000002',
 'Training vs Testing',
 'training-vs-testing',
 'A key concept in ML: never test your model on the same data it was trained on.\n\nWhy? The model might simply memorize the training data instead of learning general patterns. This is called overfitting.\n\nSolution: split your data into two parts:\n- Training set (typically 80%) — used to train the model\n- Testing set (typically 20%) — used to evaluate on unseen data\n\nThis gives you a realistic estimate of how the model will perform in the real world.',
 '# Good: train and test on different data\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\nmodel.fit(X_train, y_train)\n\n# BAD: testing on training data (overfitting!)\n# model.fit(X, y)\n# model.score(X, y)  # misleadingly high\n\nprint("Always keep train and test data separate!")',
 3, 15)
ON CONFLICT (course_id, slug) DO NOTHING;

-- Course 3: Data Analysis with pandas
INSERT INTO courses (id, title, slug, description, category, level, icon_name, cover_image, instructor, sort_order)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Data Analysis with pandas',
  'data-analysis-with-pandas',
  'Master the pandas library for data manipulation. DataFrames, filtering, grouping, and real analysis.',
  'Data',
  'Beginner',
  'BarChart3',
  'https://images.pexels.com/photos/6424586/pexels-photo-6424586.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  'Prof. Carlos Mendez',
  3
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000003',
 'Introduction to DataFrames',
 'introduction-to-dataframes',
 'A DataFrame is a 2D table of data, like a spreadsheet or SQL table. It is the core data structure in pandas.\n\nYou can create a DataFrame from a dictionary, a list of lists, or load data from CSV files, Excel, SQL databases, and more.\n\nOnce your data is in a DataFrame, you can filter, sort, group, and analyze it with just a few lines of code.',
 'import pandas as pd\n\n# Create from dictionary\ndata = {\n    "name": ["Alice", "Bob", "Charlie"],\n    "age": [20, 22, 21],\n    "grade": [85, 92, 78]\n}\ndf = pd.DataFrame(data)\nprint(df)\n#       name  age  grade\n# 0    Alice   20     85\n# 1      Bob   22     92\n# 2  Charlie   21     78\n\n# Basic info\nprint(df.shape)     # (3, 3)\nprint(df.columns)   # name, age, grade\nprint(df.describe())  # statistics',
 1, 20)
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000003',
 'Filtering and Sorting',
 'filtering-and-sorting',
 'Filtering lets you select rows that meet a condition. Sorting arranges rows by one or more columns.\n\nYou filter by applying a boolean condition to the DataFrame. You sort using the sort_values() method.\n\nThese two operations cover a huge portion of real-world data analysis tasks.',
 'import pandas as pd\n\ndf = pd.DataFrame({\n    "name": ["Alice", "Bob", "Charlie", "Diana"],\n    "score": [85, 92, 78, 95]\n})\n\n# Filter: only scores above 80\nhigh_scorers = df[df["score"] > 80]\nprint(high_scorers)\n#     name  score\n# 0  Alice     85\n# 1    Bob     92\n# 3  Diana     95\n\n# Sort by score descending\ntop = df.sort_values("score", ascending=False)\nprint(top)',
 2, 20)
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, content, code_example, sort_order, duration_min) VALUES
('a0000000-0000-0000-0000-000000000003',
 'Grouping and Aggregation',
 'grouping-and-aggregation',
 'Grouping lets you split data by a category and compute summary statistics for each group.\n\nThe pattern is: split -> apply -> combine.\n1. Split the data into groups by one or more columns\n2. Apply an aggregation function (mean, sum, count, etc.)\n3. Combine the results into a new DataFrame\n\nThis is one of the most powerful features of pandas.',
 'import pandas as pd\n\ndf = pd.DataFrame({\n    "department": ["CS", "CS", "Math", "Math", "CS"],\n    "student": ["Alice", "Bob", "Charlie", "Diana", "Eve"],\n    "score": [85, 92, 78, 95, 88]\n})\n\n# Average score per department\navg = df.groupby("department")["score"].mean()\nprint(avg)\n# department\n# CS     88.333333\n# Math   86.500000\n\n# Count students per department\ncounts = df.groupby("department")["student"].count()\nprint(counts)',
 3, 25)
ON CONFLICT (course_id, slug) DO NOTHING;
