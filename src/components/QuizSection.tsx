import { useEffect, useState } from 'react';
import { supabase, type QuizQuestion } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { CheckCircle2, XCircle, Award, Loader2, RotateCcw } from 'lucide-react';

export default function QuizSection({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reload questions whenever the lesson or signed-in user changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setError(null);

    (async () => {
      const { data } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('sort_order');
      if (cancelled) return;
      setQuestions((data ?? []) as QuizQuestion[]);

      // Load existing attempts if user is logged in
      if (user && data && data.length > 0) {
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('question_id, selected_index, is_correct')
          .eq('user_id', user.id)
          .in('question_id', data.map((q: QuizQuestion) => q.id));

        if (!cancelled && attempts && attempts.length > 0) {
          const existing: Record<string, number> = {};
          attempts.forEach((a: { question_id: string; selected_index: number }) => {
            existing[a.question_id] = a.selected_index;
          });
          setAnswers(existing);
          setSubmitted(true);
        }
      }

      if (!cancelled) setLoading(false);
    })().catch(() => {
      if (!cancelled) {
        setError('Unable to load this quiz. Please refresh and try again.');
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [lessonId, user?.id]);

  const score = questions.filter(q => answers[q.id] === q.correct_index).length;
  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  const submit = async () => {
    if (!user || !allAnswered) return;
    setSaving(true);
    setError(null);

    // Upsert all attempts
    const rows = questions.map(q => ({
      user_id: user.id,
      question_id: q.id,
      selected_index: answers[q.id],
      is_correct: answers[q.id] === q.correct_index,
    }));

    const { error: saveError } = await supabase
      .from('quiz_attempts')
      .upsert(rows, { onConflict: 'user_id,question_id' });

    if (saveError) {
      setError('Your answers could not be saved. Please try again.');
    } else {
      setSubmitted(true);
    }
    setSaving(false);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading quiz...
      </div>
    );
  }

  if (error && questions.length === 0) {
    return <p role="alert" className="mt-6 text-sm text-error-600">{error}</p>;
  }
  if (questions.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-accent-500" />
        <h3 className="font-bold text-gray-900">Quick Quiz</h3>
        {submitted && (
          <span className="ml-auto text-sm font-semibold text-gray-600">
            Score: {score}/{questions.length}
          </span>
        )}
      </div>

      {error && <p role="alert" className="mb-4 text-sm text-error-600">{error}</p>}

      <div className="space-y-5">
        {questions.map((q, qi) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correct_index;

          return (
            <div key={q.id} className="bg-gray-50 rounded-xl p-4">
              <p className="font-medium text-gray-800 text-sm mb-3">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.choices.map((choice, ci) => {
                  const isSelected = selected === ci;
                  const showCorrect = submitted && ci === q.correct_index;
                  const showWrong = submitted && isSelected && !isCorrect;

                  return (
                    <button
                      key={ci}
                      disabled={submitted}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: ci }))}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm border transition-all ${
                        showCorrect
                          ? 'bg-success-50 border-success-300 text-success-800'
                          : showWrong
                          ? 'bg-error-50 border-error-300 text-error-700'
                          : isSelected
                          ? 'bg-primary-50 border-primary-300 text-primary-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-primary-200'
                      } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        showCorrect
                          ? 'bg-success-500 text-white'
                          : showWrong
                          ? 'bg-error-500 text-white'
                          : isSelected
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + ci)}
                      </span>
                      <span className="flex-1">{choice}</span>
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-success-600" />}
                      {showWrong && <XCircle className="w-4 h-4 text-error-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between">
        {submitted ? (
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${score === questions.length ? 'text-success-600' : 'text-gray-600'}`}>
              {score === questions.length ? 'Perfect! All correct.' : `${score} out of ${questions.length} correct`}
            </span>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try again
            </button>
          </div>
        ) : (
          <>
            <span className="text-xs text-gray-400">
              {Object.keys(answers).length}/{questions.length} answered
            </span>
            <button
              onClick={submit}
              disabled={!allAnswered || saving || !user}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Submit Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}
