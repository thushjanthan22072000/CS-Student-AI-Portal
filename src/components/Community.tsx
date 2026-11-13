import { useState } from 'react';
import { Mail, CheckCircle2, Users, MessageCircle, Calendar, Github, Twitter, Linkedin } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Kumar',
    role: 'CS Junior, IIT Delhi',
    quote: "I went from zero Python to landing an ML internship in one semester. The structured paths made it possible.",
  },
  {
    name: 'Priya Sharma',
    role: 'CS Senior, NUS Singapore',
    quote: 'The Docker labs and PyTorch templates saved me weeks on my final-year project. Best CS resource I have found.',
  },
  {
    name: 'Diego Martinez',
    role: 'CS Sophomore, MIT',
    quote: 'The AI hints are like having a TA available 24/7. I never get stuck for more than a few minutes.',
  },
];

const communityLinks = [
  { icon: Users, label: 'Study Groups', desc: 'Join cohort-based study circles' },
  { icon: MessageCircle, label: 'Discord', desc: 'Chat with 50K+ CS students' },
  { icon: Calendar, label: 'Events', desc: 'Weekly workshops & hackathons' },
  { icon: Github, label: 'Open Source', desc: 'Contribute to CSLearn itself' },
];

export default function Community() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="community" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-sm font-semibold text-primary-600 tracking-wide uppercase">Community</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
              You are not learning alone
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Join a thriving community of CS students passionate about AI and Python.
              Learn together, build together, grow together.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {communityLinks.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-primary-200 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{c.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 p-8 text-white shadow-xl shadow-primary-500/20">
              <h3 className="text-2xl font-bold">Stay in the loop</h3>
              <p className="mt-2 text-primary-50/90">
                Get weekly Python tips, AI tutorials, and project ideas in your inbox.
                No spam, ever.
              </p>

              {submitted ? (
                <div className="mt-6 flex items-center gap-2 text-white bg-white/20 rounded-xl px-4 py-3.5 backdrop-blur">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">You are subscribed! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900 placeholder-gray-400 bg-white border-0 focus:ring-2 focus:ring-white/50 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl font-semibold text-primary-600 bg-white hover:bg-primary-50 transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
              <p className="mt-3 text-sm text-primary-50/70">Join 50,000+ students. Unsubscribe anytime.</p>
            </div>

            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-2xl bg-white border border-gray-200 p-5">
                  <p className="text-sm text-gray-700 leading-relaxed">"{t.quote}"</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
