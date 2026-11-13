import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LearningPaths from '@/components/LearningPaths';
import Courses from '@/components/Courses';
import Features from '@/components/Features';
import Resources from '@/components/Resources';
import Community from '@/components/Community';
import Footer from '@/components/Footer';
import AuthPage from '@/pages/AuthPage';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminPage from '@/pages/AdminPage';
import { useAuth } from '@/lib/auth';

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}

function Router() {
  const { loading } = useAuth();
  const hash = useHashRoute();

  // Handle section scrolling on landing page
  useEffect(() => {
    const section = hash.replace(/^#/, '');
    if (section && !section.startsWith('/')) {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (!section) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Parse hash: #/courses, #/course/python-for-beginners, #/auth, #/ (home)
  const cleanHash = hash.replace(/^#/, '');
  const parts = cleanHash.split('/').filter(Boolean);

  // Route: /auth
  if (parts[0] === 'auth') {
    return <AuthPage />;
  }

  // Route: /courses
  if (parts[0] === 'courses') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <CoursesPage />
        <Footer />
      </div>
    );
  }

  // Route: /course/:slug
  if (parts[0] === 'course' && parts[1]) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <CourseDetailPage slug={parts[1]} />
        <Footer />
      </div>
    );
  }

  // Route: /dashboard
  if (parts[0] === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <DashboardPage />
        <Footer />
      </div>
    );
  }

  // Route: /admin
  if (parts[0] === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AdminPage />
        <Footer />
      </div>
    );
  }

  // Default: landing page
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <LearningPaths />
        <Courses />
        <Features />
        <Resources />
        <Community />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <Router />;
}
