import { useState, useEffect } from 'react';
import { Brain, Menu, X, Github, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const links = [
  { label: 'Home', href: '#/' },
  { label: 'Paths', href: '#paths' },
  { label: 'Courses', href: '#/courses' },
  { label: 'Features', href: '#features' },
  { label: 'Resources', href: '#resources' },
  { label: 'Community', href: '#community' },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30">
              <Brain className="w-5 h-5" />
            </span>
            <span className="text-gray-900">
              CS<span className="gradient-text">Learn</span>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <a
                  href="#/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </a>
                <a
                  href="#/admin"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Admin
                </a>
              </>
            )}
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  <User className="w-4 h-4 flex-shrink-0" />
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-error-600 hover:bg-error-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <a
                href="#/auth"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Get Started
              </a>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden glass border-t border-gray-200/60">
          <ul className="px-4 py-4 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <a
                    href="#/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#/admin"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    Admin Panel
                  </a>
                </li>
                <li className="px-4 py-2 text-sm text-gray-500">
                  Signed in as {user.email}
                </li>
                <li>
                  <button
                    onClick={() => { signOut(); setOpen(false); }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-error-600 hover:bg-error-50"
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <a
                  href="#/auth"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-semibold text-center text-white bg-gradient-to-r from-primary-500 to-secondary-500"
                >
                  Get Started
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
