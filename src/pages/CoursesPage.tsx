import { useEffect, useState } from 'react';
import { supabase, type Course } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Clock, BookOpen, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

type CourseWithProgress = Course & {
  lesson_count: number;
  enrolled: boolean;
  completed_lessons: number;
};

const iconMap: Record<string, string> = {
  Code2: '💻',
  Brain: '🧠',
  BarChart3: '📊',
};

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('sort_order');

    if (!courseData) { setLoading(false); return; }

    // Get lesson counts
    const { data: lessons } = await supabase
      .from('lessons')
      .select('course_id, id');

    const lessonCountMap: Record<string, number> = {};
    const lessonIdsByCourse: Record<string, string[]> = {};
    (lessons ?? []).forEach((l: { course_id: string; id: string }) => {
      lessonCountMap[l.course_id] = (lessonCountMap[l.course_id] || 0) + 1;
      if (!lessonIdsByCourse[l.course_id]) lessonIdsByCourse[l.course_id] = [];
      lessonIdsByCourse[l.course_id].push(l.id);
    });

    let enrolledIds = new Set<string>();
    let completedIds = new Set<string>();

    if (user) {
      const { data: enrolls } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);
      (enrolls ?? []).forEach((e: { course_id: string }) => enrolledIds.add(e.course_id));

      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
        .eq('completed', true);
      (progress ?? []).forEach((p: { lesson_id: string; completed: boolean }) => {
        if (p.completed) completedIds.add(p.lesson_id);
      });
    }

    const enriched: CourseWithProgress[] = courseData.map((c: Course) => {
      const courseLessonIds = lessonIdsByCourse[c.id] || [];
      const completedInCourse = courseLessonIds.filter(id => completedIds.has(id)).length;
      return {
        ...c,
        lesson_count: lessonCountMap[c.id] || 0,
        enrolled: enrolledIds.has(c.id),
        completed_lessons: completedInCourse,
      };
    });

    setCourses(enriched);
    setLoading(false);
  };

  const enroll = async (courseId: string) => {
    if (!user) return;
    await supabase.from('enrollments').insert({ course_id: courseId });
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolled: true } : c));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Free Courses</h1>
          <p className="mt-2 text-gray-600 text-lg">
            All courses are 100% free. Enroll and start learning immediately.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => {
            const progress = c.lesson_count > 0
              ? Math.round((c.completed_lessons / c.lesson_count) * 100)
              : 0;
            return (
              <article
                key={c.id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden">
                  {c.cover_image && (
                    <img
                      src={c.cover_image}
                      alt={c.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success-500 text-white">
                      Free
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-900 backdrop-blur">
                      {c.level}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{iconMap[c.icon_name] || '📚'}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 font-medium">
                      {c.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg leading-snug">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed line-clamp-2">{c.description}</p>
                  <p className="mt-2 text-xs text-gray-400">By {c.instructor}</p>

                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" /> {c.lesson_count} lessons
                    </span>
                  </div>

                  {c.enrolled && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span>{c.completed_lessons}/{c.lesson_count} completed</span>
                        <span className="font-semibold text-primary-600">{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-5">
                    {c.enrolled ? (
                      <a
                        href={`#/course/${c.slug}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transition-all"
                      >
                        Continue Learning <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : user ? (
                      <button
                        onClick={() => enroll(c.id)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-primary-500 hover:text-white transition-all"
                      >
                        Enroll Free <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <a
                        href="#/auth"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-primary-500 hover:text-white transition-all"
                      >
                        Sign up to Enroll <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
