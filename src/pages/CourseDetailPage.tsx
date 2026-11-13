import { useEffect, useState } from 'react';
import { supabase, type Course, type Lesson } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import CodeRunner from '@/components/CodeRunner';
import QuizSection from '@/components/QuizSection';
import {
  ArrowLeft, CheckCircle2, Circle, Clock, BookOpen, Copy, Check,
  ArrowRight, Loader2, GraduationCap
} from 'lucide-react';

export default function CourseDetailPage({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [slug, user]);

  const loadCourse = async () => {
    setLoading(true);
    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!courseData) { setLoading(false); return; }
    setCourse(courseData);

    const { data: lessonData } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseData.id)
      .order('sort_order');

    const sortedLessons = (lessonData ?? []) as Lesson[];
    setLessons(sortedLessons);
    if (sortedLessons.length > 0) setActiveLesson(sortedLessons[0]);

    if (user) {
      const { data: enrolls } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .maybeSingle();
      setEnrolled(!!enrolls);

      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
        .eq('completed', true);

      setCompletedIds(new Set(
        (progress ?? []).map((p: { lesson_id: string }) => p.lesson_id)
      ));
    }

    setLoading(false);
  };

  const enroll = async () => {
    if (!user || !course) return;
    await supabase.from('enrollments').insert({ course_id: course.id });
    setEnrolled(true);
  };

  const toggleComplete = async (lessonId: string) => {
    if (!user) return;
    const isCompleted = completedIds.has(lessonId);

    if (isCompleted) {
      await supabase
        .from('lesson_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);
      setCompletedIds(prev => {
        const next = new Set(prev);
        next.delete(lessonId);
        return next;
      });
    } else {
      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      setCompletedIds(prev => new Set(prev).add(lessonId));
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextLesson = () => {
    if (!activeLesson) return;
    const idx = lessons.findIndex(l => l.id === activeLesson.id);
    if (idx < lessons.length - 1) goToLesson(lessons[idx + 1]);
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="ml-4 text-gray-700">{line.slice(2)}</li>
        );
      }
      if (line.startsWith('  - ')) {
        return (
          <li key={i} className="ml-8 text-gray-600 text-sm">{line.slice(4)}</li>
        );
      }
      if (line.trim() === '') return <div key={i} className="h-3" />;
      return <p key={i} className="text-gray-700">{line}</p>;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Course not found.</p>
          <a href="#/courses" className="mt-4 inline-block text-primary-600 font-medium">Back to courses</a>
        </div>
      </div>
    );
  }

  const totalDuration = lessons.reduce((sum, l) => sum + l.duration_min, 0);
  const progressPct = lessons.length > 0
    ? Math.round((completedIds.size / lessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Course header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <a href="#/courses" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-4">
            <ArrowLeft className="w-4 h-4" /> All Courses
          </a>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 font-medium">{course.category}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{course.level}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="mt-2 text-gray-600">{course.description}</p>
              <p className="mt-2 text-sm text-gray-400">Instructor: {course.instructor}</p>

              <div className="mt-4 flex items-center gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {lessons.length} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {Math.round(totalDuration / 60)}h {totalDuration % 60}m
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Free
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              {enrolled ? (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Your Progress</span>
                    <span className="font-bold text-primary-600">{progressPct}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {completedIds.size} of {lessons.length} lessons completed
                  </p>
                </div>
              ) : user ? (
                <button
                  onClick={enroll}
                  className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                >
                  Enroll for Free
                </button>
              ) : (
                <a
                  href="#/auth"
                  className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/30 transition-all text-center block"
                >
                  Sign Up to Enroll
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar: lesson list */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Course Content</h3>
              <ul className="space-y-1">
                {lessons.map((lesson, i) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isDone = completedIds.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => goToLesson(lesson)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-primary-50 border border-primary-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0" />
                        ) : (
                          <Circle className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-400' : 'text-gray-300'}`} />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-medium truncate ${isActive ? 'text-primary-700' : 'text-gray-700'}`}>
                            {i + 1}. {lesson.title}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {lesson.duration_min} min
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Main: lesson content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {activeLesson && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{activeLesson.title}</h2>
                  <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" /> {activeLesson.duration_min} min
                  </span>
                </div>

                <div className="prose max-w-none">
                  <ul className="space-y-2 list-none">
                    {renderContent(activeLesson.content)}
                  </ul>
                </div>

                {activeLesson.code_example && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 rounded-t-xl">
                      <span className="text-xs font-mono text-gray-400">
                        {activeLesson.code_language} — example.py
                      </span>
                      <button
                        onClick={() => copyCode(activeLesson.code_example!)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? (
                          <><Check className="w-3.5 h-3.5" /> Copied</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /> Copy</>
                        )}
                      </button>
                    </div>
                    <pre className="bg-gray-900 rounded-b-xl p-5 overflow-x-auto">
                      <code className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                        {activeLesson.code_example}
                      </code>
                    </pre>
                  </div>
                )}

                {activeLesson.code_example && (
                  <CodeRunner key={activeLesson.id} initialCode={activeLesson.code_example} />
                )}

                <QuizSection key={`quiz-${activeLesson.id}`} lessonId={activeLesson.id} />

                {enrolled && user ? (
                  <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => toggleComplete(activeLesson.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        completedIds.has(activeLesson.id)
                          ? 'bg-success-50 text-success-700 border border-success-200'
                          : 'bg-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/30'
                      }`}
                    >
                      {completedIds.has(activeLesson.id) ? (
                        <><CheckCircle2 className="w-5 h-5" /> Completed</>
                      ) : (
                        <><Circle className="w-5 h-5" /> Mark as Complete</>
                      )}
                    </button>

                    {lessons.findIndex(l => l.id === activeLesson.id) < lessons.length - 1 && (
                      <button
                        onClick={goToNextLesson}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        Next Lesson <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : !user ? (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <a
                      href="#/auth"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transition-all"
                    >
                      Sign up to track progress <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
