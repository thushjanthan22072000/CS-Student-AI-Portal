import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  icon_name: string;
  cover_image: string | null;
  instructor: string;
  sort_order: number;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  content: string;
  code_example: string | null;
  code_language: string;
  sort_order: number;
  duration_min: number;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
};

export type QuizQuestion = {
  id: string;
  lesson_id: string;
  question: string;
  choices: string[];
  correct_index: number;
  sort_order: number;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  question_id: string;
  selected_index: number;
  is_correct: boolean;
  attempted_at: string;
};
