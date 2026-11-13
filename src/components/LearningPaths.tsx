import { ArrowRight, Code2, Brain, Database, Cpu, BarChart3, Bot } from 'lucide-react';

const paths = [
  {
    icon: Code2,
    title: 'Python Foundations',
    desc: 'Syntax, data structures, OOP, and the standard library. Build a rock-solid base.',
    level: 'Beginner',
    hours: '40 hrs',
    color: 'primary',
    topics: ['Variables & Types', 'Functions', 'Classes', 'File I/O', 'Decorators'],
  },
  {
    icon: Brain,
    title: 'Machine Learning',
    desc: 'Supervised & unsupervised learning with scikit-learn. Go from theory to models.',
    level: 'Intermediate',
    hours: '60 hrs',
    color: 'secondary',
    topics: ['Regression', 'Classification', 'Clustering', 'Feature Eng.', 'Evaluation'],
  },
  {
    icon: Bot,
    title: 'Deep Learning',
    desc: 'Neural networks with PyTorch. CNNs, RNNs, transformers, and everything modern.',
    level: 'Advanced',
    hours: '80 hrs',
    color: 'accent',
    topics: ['PyTorch Basics', 'CNNs', 'RNNs/LSTMs', 'Transformers', 'Deployment'],
  },
  {
    icon: Database,
    title: 'Data Engineering',
    desc: 'Pipelines, PostgreSQL, and data wrangling with pandas and NumPy.',
    level: 'Intermediate',
    hours: '50 hrs',
    color: 'primary',
    topics: ['pandas', 'NumPy', 'PostgreSQL', 'ETL', 'Data Viz'],
  },
  {
    icon: Cpu,
    title: 'AI Systems',
    desc: 'MLOps, model serving with Docker & FastAPI. Ship models to production.',
    level: 'Advanced',
    hours: '45 hrs',
    color: 'secondary',
    topics: ['Docker', 'FastAPI', 'CI/CD', 'Monitoring', 'Scaling'],
  },
  {
    icon: BarChart3,
    title: 'Data Science',
    desc: 'Statistics, visualization, and storytelling. Turn data into decisions.',
    level: 'Beginner',
    hours: '35 hrs',
    color: 'accent',
    topics: ['Statistics', 'Matplotlib', 'Seaborn', 'EDA', 'Reporting'],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'hover:border-primary-300', badge: 'bg-primary-100 text-primary-700' },
  secondary: { bg: 'bg-secondary-50', text: 'text-secondary-600', border: 'hover:border-secondary-300', badge: 'bg-secondary-100 text-secondary-700' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600', border: 'hover:border-accent-300', badge: 'bg-accent-100 text-accent-700' },
};

export default function LearningPaths() {
  return (
    <section id="paths" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary-600 tracking-wide uppercase">Learning Paths</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
            Structured journeys from beginner to expert
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Each path is a curated sequence of courses, projects, and assessments
            designed by industry engineers and CS professors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((p) => {
            const c = colorMap[p.color];
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 ${c.border} hover:shadow-xl hover:-translate-y-1`}
              >
                <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-7 h-7 ${c.text}`} />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.badge}`}>{p.level}</span>
                  <span className="text-xs text-gray-400">{p.hours}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{p.desc}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.topics.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-100">
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href="#/courses"
                  className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} group-hover:gap-2.5 transition-all`}
                >
                  Start path <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
