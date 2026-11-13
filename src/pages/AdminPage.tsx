import { useEffect, useState } from 'react';
import { supabase, type Course, type Lesson } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  Plus, Trash2, Edit3, BookOpen, FileText, X, Save,
  Loader2, ChevronDown, ChevronRight, ArrowLeft
} from 'lucide-react';

type AdminLesson = Lesson & {
  quiz_count?: number;
};

export default function AdminPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessonsByCourse, setLessonsByCourse] = useState<Record<string, AdminLesson[]>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Form state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonCourseId, setLessonCourseId] = useState<string>('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order');

    setCourses((courseData ?? []) as Course[]);

    if (courseData && courseData.length > 0) {
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .order('sort_order');

      const map: Record<string, AdminLesson[]> = {};
      (lessonData ?? []).forEach((l: Lesson) => {
        if (!map[l.course_id]) map[l.course_id] = [];
        map[l.course_id].push(l as AdminLesson);
      });
      setLessonsByCourse(map);
    }

    setLoading(false);
  };

  const toggleExpand = (courseId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Delete this course and all its lessons? This cannot be undone.')) return;
    await supabase.from('courses').delete().eq('id', id);
    await loadData();
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Delete this lesson?')) return;
    await supabase.from('lessons').delete().eq('id', id);
    await loadData();
  };

  const openAddCourse = () => {
    setEditingCourse(null);
    setShowCourseForm(true);
  };

  const openEditCourse = (c: Course) => {
    setEditingCourse(c);
    setShowCourseForm(true);
  };

  const openAddLesson = (courseId: string) => {
    setEditingLesson(null);
    setLessonCourseId(courseId);
    setShowLessonForm(true);
  };

  const openEditLesson = (l: AdminLesson, courseId: string) => {
    setEditingLesson(l);
    setLessonCourseId(courseId);
    setShowLessonForm(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Please log in to access the admin panel.</p>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <a href="#/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </a>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="mt-1 text-gray-600">Manage courses and lessons</p>
            </div>
            <button
              onClick={openAddCourse}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> New Course
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {courses.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No courses yet. Click "New Course" to create one.</p>
            </div>
          )}

          {courses.map((c) => {
            const isExpanded = expanded.has(c.id);
            const courseLessons = lessonsByCourse[c.id] || [];

            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => toggleExpand(c.id)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{c.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c.category} · {c.level} · {courseLessons.length} lessons
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditCourse(c)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCourse(c.id)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-error-50 hover:text-error-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Lessons</span>
                        <button
                          onClick={() => openAddLesson(c.id)}
                          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Lesson
                        </button>
                      </div>

                      {courseLessons.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No lessons yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {courseLessons.map((l, i) => (
                            <div
                              key={l.id}
                              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-sm text-gray-700 truncate">
                                  {i + 1}. {l.title}
                                </span>
                                <span className="text-xs text-gray-400 flex-shrink-0">{l.duration_min}min</span>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => openEditLesson(l, c.id)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteLesson(l.id)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:bg-error-50 hover:text-error-600 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          onClose={() => setShowCourseForm(false)}
          onSaved={() => { setShowCourseForm(false); loadData(); }}
        />
      )}

      {showLessonForm && (
        <LessonForm
          lesson={editingLesson}
          courseId={lessonCourseId}
          nextSortOrder={(lessonsByCourse[lessonCourseId] || []).length + 1}
          onClose={() => setShowLessonForm(false)}
          onSaved={() => { setShowLessonForm(false); loadData(); }}
        />
      )}
    </div>
  );
}

// ============ Course Form Modal ============
function CourseForm({
  course,
  onClose,
  onSaved,
}: {
  course: Course | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(course?.title || '');
  const [slug, setSlug] = useState(course?.slug || '');
  const [description, setDescription] = useState(course?.description || '');
  const [category, setCategory] = useState(course?.category || 'Python');
  const [level, setLevel] = useState(course?.level || 'Beginner');
  const [instructor, setInstructor] = useState(course?.instructor || '');
  const [iconName, setIconName] = useState(course?.icon_name || 'Code2');
  const [coverImage, setCoverImage] = useState(course?.cover_image || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const sortOrder = course?.sort_order ?? (Date.now() % 1000);

    const payload = {
      title,
      slug: finalSlug,
      description,
      category,
      level,
      instructor: instructor || 'CSLearn Team',
      icon_name: iconName,
      cover_image: coverImage || null,
      sort_order: sortOrder,
      is_published: true,
    };

    let result;
    if (course) {
      result = await supabase.from('courses').update(payload).eq('id', course.id);
    } else {
      result = await supabase.from('courses').insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">
            {course ? 'Edit Course' : 'New Course'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-error-50 text-error-700 text-sm">{error}</div>
          )}

          <Field label="Title">
            <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Python for Beginners" />
          </Field>

          <Field label="Slug (URL)" hint="Leave empty to auto-generate from title">
            <input value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} placeholder="python-for-beginners" />
          </Field>

          <Field label="Description">
            <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} min-h-[80px] resize-y`} placeholder="Short course description" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                <option>Python</option>
                <option>AI</option>
                <option>Data</option>
                <option>Web</option>
                <option>Algorithms</option>
              </select>
            </Field>
            <Field label="Level">
              <select value={level} onChange={e => setLevel(e.target.value)} className={inputClass}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </Field>
          </div>

          <Field label="Instructor">
            <input value={instructor} onChange={e => setInstructor(e.target.value)} className={inputClass} placeholder="Dr. Sarah Chen" />
          </Field>

          <Field label="Icon" hint="Lucide icon name">
            <select value={iconName} onChange={e => setIconName(e.target.value)} className={inputClass}>
              <option>Code2</option>
              <option>Brain</option>
              <option>BarChart3</option>
              <option>Globe</option>
              <option>Cpu</option>
            </select>
          </Field>

          <Field label="Cover Image URL" hint="Optional — leave empty for no image">
            <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className={inputClass} placeholder="https://..." />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !title}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {course ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ Lesson Form Modal ============
function LessonForm({
  lesson,
  courseId,
  nextSortOrder,
  onClose,
  onSaved,
}: {
  lesson: AdminLesson | null;
  courseId: string;
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(lesson?.title || '');
  const [slug, setSlug] = useState(lesson?.slug || '');
  const [content, setContent] = useState(lesson?.content || '');
  const [codeExample, setCodeExample] = useState(lesson?.code_example || '');
  const [duration, setDuration] = useState(lesson?.duration_min ?? 15);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const sortOrder = lesson?.sort_order ?? nextSortOrder;

    const payload = {
      course_id: courseId,
      title,
      slug: finalSlug,
      content,
      code_example: codeExample || null,
      code_language: 'python',
      sort_order: sortOrder,
      duration_min: duration,
    };

    let result;
    if (lesson) {
      result = await supabase.from('lessons').update(payload).eq('id', lesson.id);
    } else {
      result = await supabase.from('lessons').insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">
            {lesson ? 'Edit Lesson' : 'New Lesson'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-error-50 text-error-700 text-sm">{error}</div>
          )}

          <Field label="Lesson Title">
            <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Variables and Data Types" />
          </Field>

          <Field label="Slug" hint="Leave empty to auto-generate">
            <input value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} placeholder="variables-and-data-types" />
          </Field>

          <Field label="Content" hint="Use plain text. Start lines with '- ' for bullet points.">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className={`${inputClass} min-h-[120px] resize-y font-mono text-sm`}
              placeholder={"In Python, a variable is a name that points to a value.\n- int — whole numbers\n- str — text"}
            />
          </Field>

          <Field label="Python Code Example" hint="Optional — shown with a Run button">
            <textarea
              value={codeExample}
              onChange={e => setCodeExample(e.target.value)}
              className={`${inputClass} min-h-[100px] resize-y font-mono text-sm bg-gray-900 text-gray-300`}
              placeholder={"# Example code\nprint('Hello, World!')"}
            />
          </Field>

          <Field label="Duration (minutes)">
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value) || 10)}
              className={inputClass}
              min={1}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !title}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {lesson ? 'Save Changes' : 'Create Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ Shared form helpers ============
const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
