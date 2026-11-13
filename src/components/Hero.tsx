import { ArrowRight, Code2, Brain, Sparkles, Terminal } from 'lucide-react';

const stats = [
  { value: '120+', label: 'Courses' },
  { value: '50K+', label: 'Students' },
  { value: '4.9', label: 'Avg Rating' },
];

const codeLines = [
  { txt: 'import torch', color: 'text-secondary-400' },
  { txt: 'from transformers import pipeline', color: 'text-secondary-400' },
  { txt: '', color: '' },
  { txt: '# Build your first AI model', color: 'text-gray-500' },
  { txt: 'model = pipeline("sentiment-analysis")', color: 'text-primary-400' },
  { txt: 'result = model("CS students love Python!")', color: 'text-accent-400' },
  { txt: 'print(result)', color: 'text-white' },
  { txt: '# [{"label": "POSITIVE", "score": 0.98}]', color: 'text-gray-500' },
];

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 via-transparent to-white pointer-events-none" />
      <div className="absolute top-20 -right-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-glow" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary-200/30 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Learn AI & Python from zero to pro
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-balance text-gray-900">
              Master <span className="gradient-text">Python</span> &{' '}
              <span className="gradient-text">AI</span> as a CS student
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              Structured learning paths, hands-on projects, and real-world AI
              tools. Everything you need to go from classroom theory to
              building production-grade intelligent systems.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#/courses"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-xl hover:shadow-primary-500/30 transition-all hover:-translate-y-0.5"
              >
                Explore Paths <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#/courses"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                <Terminal className="w-5 h-5" /> Browse Courses
              </a>
            </div>

            <div className="mt-12 flex gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold gradient-text">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary-200 to-secondary-200 rounded-3xl blur-2xl opacity-50" />
            <div className="relative rounded-2xl bg-gray-900 shadow-2xl overflow-hidden border border-gray-800">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-800/50">
                <div className="w-3 h-3 rounded-full bg-error-500" />
                <div className="w-3 h-3 rounded-full bg-warning-500" />
                <div className="w-3 h-3 rounded-full bg-success-500" />
                <span className="ml-2 text-xs text-gray-400 font-mono">main.py — CSLearn</span>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-gray-600 select-none w-4 text-right">{i + 1}</span>
                    <span className={line.color || 'text-gray-300'}>{line.txt || '\u00A0'}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 text-xs font-medium">
                  <Code2 className="w-3.5 h-3.5" /> Python
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-500/10 text-secondary-400 text-xs font-medium">
                  <Brain className="w-3.5 h-3.5" /> PyTorch
                </span>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 animate-float">
              <div className="glass rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">AI-Powered Hints</div>
                    <div className="text-xs text-gray-500">Stuck? Get instant help</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
