import { Code2, BrainCircuit, GitBranch, Trophy, Wrench, Users2 } from 'lucide-react';

const features = [
  {
    icon: Code2,
    title: 'In-Browser Coding',
    desc: 'Write and run Python directly in your browser. No setup, no installs. Just open and code.',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Assistance',
    desc: 'Get instant hints, code review, and explanations powered by AI. Learn faster, never stay stuck.',
  },
  {
    icon: GitBranch,
    title: 'Real-World Projects',
    desc: 'Build a portfolio with GitHub-ready projects: chatbots, classifiers, recommendation engines.',
  },
  {
    icon: Trophy,
    title: 'Skill Badges',
    desc: 'Earn verifiable badges for each completed path. Showcase them on LinkedIn and your resume.',
  },
  {
    icon: Wrench,
    title: 'Developer Tools',
    desc: 'Pre-configured Docker environments, Jupyter notebooks, and VS Code templates included.',
  },
  {
    icon: Users2,
    title: 'Peer Community',
    desc: 'Join study groups, pair-program with peers, and get mentorship from senior students.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary-400 tracking-wide uppercase">Why CSLearn</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white text-balance">
            Everything a CS student needs to master AI
          </h2>
          <p className="mt-4 text-gray-400 text-lg">
            We combine curriculum, tooling, and community into a single platform
            built specifically for computer science students.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800 hover:border-primary-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/20 flex items-center justify-center mb-5 group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-all">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
