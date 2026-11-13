import { Brain, Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const columns = [
  {
    title: 'Learn',
    links: ['Python Paths', 'AI Paths', 'Data Science', 'Deep Learning', 'All Courses'],
  },
  {
    title: 'Resources',
    links: ['Articles', 'Code Templates', 'Video Tutorials', 'Hands-On Labs', 'Cheatsheets'],
  },
  {
    title: 'Community',
    links: ['Discord', 'Study Groups', 'Events', 'Open Source', 'Mentorship'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Privacy', 'Terms'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2 font-bold text-lg text-white">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                <Brain className="w-5 h-5" />
              </span>
              CS<span className="gradient-text">Learn</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              The learning platform built for computer science students who want to
              master Python and artificial intelligence.
            </p>
            <div className="mt-6 flex gap-3">
              {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 CSLearn. Built by CS students, for CS students.</p>
          <p className="text-sm">Made with Python, React & lots of coffee.</p>
        </div>
      </div>
    </footer>
  );
}
