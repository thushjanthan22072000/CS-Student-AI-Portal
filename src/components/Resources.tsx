import { BookOpen, FileCode2, Video, FlaskConical, ExternalLink } from 'lucide-react';

const resourceGroups = [
  {
    icon: BookOpen,
    label: 'Articles & Guides',
    color: 'primary',
    items: [
      { title: 'Understanding Gradient Descent Visually', tag: 'ML' },
      { title: 'A Beginner-Friendly Guide to PyTorch Tensors', tag: 'PyTorch' },
      { title: 'OOP in Python: Beyond the Basics', tag: 'Python' },
      { title: 'How Transformers Actually Work', tag: 'NLP' },
    ],
  },
  {
    icon: FileCode2,
    label: 'Code Snippets & Templates',
    color: 'secondary',
    items: [
      { title: 'FastAPI + PyTorch Model Serving Template', tag: 'MLOps' },
      { title: 'Docker Compose for ML Projects', tag: 'Docker' },
      { title: 'Web Scraper with BeautifulSoup', tag: 'Python' },
      { title: 'pandas Data Cleaning Cheat Sheet', tag: 'Data' },
    ],
  },
  {
    icon: Video,
    label: 'Video Tutorials',
    color: 'accent',
    items: [
      { title: 'Build a Neural Network from Scratch (45 min)', tag: 'DL' },
      { title: 'PostgreSQL for Python Developers (1 hr)', tag: 'SQL' },
      { title: 'NumPy in 20 Minutes', tag: 'Python' },
      { title: 'Deploying ML Models with Docker', tag: 'MLOps' },
    ],
  },
  {
    icon: FlaskConical,
    label: 'Hands-On Labs',
    color: 'primary',
    items: [
      { title: 'Lab: Train a Sentiment Classifier', tag: 'NLP' },
      { title: 'Lab: Image Recognition with CNNs', tag: 'CV' },
      { title: 'Lab: Build a Recommendation System', tag: 'ML' },
      { title: 'Lab: Time Series Forecasting', tag: 'Data' },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; tag: string }> = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', tag: 'bg-primary-100 text-primary-700' },
  secondary: { bg: 'bg-secondary-50', text: 'text-secondary-600', tag: 'bg-secondary-100 text-secondary-700' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600', tag: 'bg-accent-100 text-accent-700' },
};

export default function Resources() {
  return (
    <section id="resources" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary-600 tracking-wide uppercase">Resources</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
            A library built by CS students, for CS students
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Articles, templates, video tutorials, and interactive labs — all free,
            all curated, all practical.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {resourceGroups.map((g) => {
            const c = colorMap[g.color];
            const Icon = g.icon;
            return (
              <div key={g.label} className="rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <Icon className={`w-5.5 h-5.5 ${c.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{g.label}</h3>
                </div>

                <ul className="space-y-3">
                  {g.items.map((item) => (
                    <li key={item.title}>
                      <a
                        href="#"
                        className="group flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${c.tag} flex-shrink-0`}>
                            {item.tag}
                          </span>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                            {item.title}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
