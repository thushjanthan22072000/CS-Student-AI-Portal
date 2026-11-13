import { useEffect, useState } from 'react';
import { supabase, type Course, type Lesson } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  ArrowRight, BookOpen, Clock, CheckCircle2, TrendingUp,
  Award, Loader2, GraduationCap
} from 'lucide-react';

type DashboardCourse = Course & {
  lesson_count: number;
  completed_lessons: number;
  enrolled_at: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;

    const { data: enrolls } = await supabase
      .from('enrollments')
      .select('course_id, enrolled_at')
      .eq('user_id', user.id);

    if (!enrolls || enrolls.length === 0) {
      setLoading(false);
      return;
    }

    const courseIds = enrolls.map(e => e.course_id);
    const enrolledAtMap: Record<string, string> = {};
    enrolls.forEach(e => { enrolledAtMap[e.course_id] = e.enrolled_at; });

    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .in('id', courseIds)
      .order('sort_order');

    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, course_id')
      .in('course_id', courseIds);

    const lessonByCourse: Record<string, string[]> = {};
    (lessons ?? []).forEach((l: { id: string; course_id: string }) => {
      if (!lessonByCourse[l.course_id]) lessonByCourse[l.course_id] = [];
      lessonByCourse[l.course_id].push(l.id);
    });

    const allLessonIds = Object.values(lessonByCourse).flat();
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('completed', true);

    const completedSet = new Set((progress ?? []).map((p: { lesson_id: string }) => p.lesson_id));

    const enriched: DashboardCourse[] = (courseData ?? []).map((c: Course) => {
      const courseLessons = lessonByCourse[c.id] || [];
      const completed = courseLessons.filter(id => completedSet.has(id)).length;
      return {
        ...c,
        lesson_count: courseLessons.length,
        completed_lessons: completed,
        enrolled_at: enrolledAtMap[c.id] || '',
      };
    });

    setCourses(enriched);

    const totalLessons = allLessonIds.length;
    const totalCompleted = allLessonIds.filter(id => completedSet.has(id)).length;
    const certs = enriched.filter(c => c.lesson_count > 0 && c.completed_lessons === c.lesson_count).length;

    setStats({ total: totalLessons, completed: totalCompleted, certificates: certs });
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Please log in to view your dashboard.</p>
          <a href="#/auth" className="mt-4 inline-block text-primary-600 font-medium">Sign in</a>
        </div>
      </div>
    );
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Lessons Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-success-50 text-success-600">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-500">Lessons Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent-50 text-accent-600">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
                <p className="text-sm text-gray-500">Courses Finished</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled courses */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Courses</h2>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You have not enrolled in any courses yet.</p>
            <a
              href="#/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transition-all"
            >
              Browse Free Courses <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {courses.map((c) => {
              const pct = c.lesson_count > 0
                ? Math.round((c.completed_lessons / c.lesson_count) * 100)
                : 0;
              const isDone = pct === 100;

              return (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
                  {c.cover_image && (
                    <div className="h-32 overflow-hidden">
                      <img src={c.cover_image} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 font-medium">
                        {c.category}
                      </span>
                      {isDone && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-success-50 text-success-600 font-medium flex items-center gap-1">
                          <Award className="w-3 h-3" /> Complete
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{c.lesson_count} lessons</p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span>{c.completed_lessons}/{c.lesson_count} completed</span>
                        <span className="font-semibold text-primary-600">{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? 'bg-success-500' : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <a
                      href={`#/course/${c.slug}`}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transition-all"
                    >
                      {pct > 0 ? 'Continue Learning' : 'Start Course'} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
