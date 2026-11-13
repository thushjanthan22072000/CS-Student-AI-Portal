import { useState } from 'react';
import { Clock, Star, Users, ArrowRight } from 'lucide-react';

const courses = [
  {
    title: 'Python for Beginners',
    instructor: 'Dr. Sarah Chen',
    img: 'https://images.pexels.com/photos/1102797/pexels-photo-1102797.png?auto=compress&cs=tinysrgb&h=400&w=600',
    duration: '12 hrs',
    students: '24.5K',
    rating: 4.9,
    price: 'Free',
    tags: ['Python', 'Basics'],
    category: 'Python',
  },
  {
    title: 'Data Structures in Python',
    instructor: 'Prof. Mike Reynolds',
    img: 'https://images.pexels.com/photos/6424591/pexels-photo-6424591.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    duration: '18 hrs',
    students: '18.2K',
    rating: 4.8,
    price: '$29',
    tags: ['Python', 'DSA'],
    category: 'Python',
  },
  {
    title: 'Intro to Machine Learning',
    instructor: 'Dr. Anika Patel',
    img: 'https://images.pexels.com/photos/17483867/pexels-photo-17483867.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    duration: '25 hrs',
    students: '32.1K',
    rating: 4.9,
    price: '$49',
    tags: ['ML', 'scikit-learn'],
    category: 'AI',
  },
  {
    title: 'Deep Learning with PyTorch',
    instructor: 'Dr. James Liu',
    img: 'https://images.pexels.com/photos/17483871/pexels-photo-17483871.png?auto=compress&cs=tinysrgb&h=400&w=600',
    duration: '40 hrs',
    students: '15.8K',
    rating: 4.9,
    price: '$79',
    tags: ['PyTorch', 'Neural Nets'],
    category: 'AI',
  },
  {
    title: 'NLP & Transformers',
    instructor: 'Dr. Emily Watson',
    img: 'https://images.pexels.com/photos/14314636/pexels-photo-14314636.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    duration: '30 hrs',
    students: '12.3K',
    rating: 4.8,
    price: '$69',
    tags: ['NLP', 'Hugging Face'],
    category: 'AI',
  },
  {
    title: 'Data Analysis with pandas',
    instructor: 'Prof. Carlos Mendez',
    img: 'https://images.pexels.com/photos/6424586/pexels-photo-6424586.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    duration: '15 hrs',
    students: '21.7K',
    rating: 4.7,
    price: 'Free',
    tags: ['pandas', 'Analysis'],
    category: 'Data',
  },
  {
    title: 'Computer Vision with OpenCV',
    instructor: 'Dr. Yuki Tanaka',
    img: 'https://images.pexels.com/photos/27427258/pexels-photo-27427258.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    duration: '22 hrs',
    students: '9.4K',
    rating: 4.8,
    price: '$59',
    tags: ['OpenCV', 'CV'],
    category: 'AI',
  },
  {
    title: 'SQL & PostgreSQL for Devs',
    instructor: 'Prof. Lisa Anderson',
    img: 'https://images.pexels.com/photos/6609460/pexels-photo-6609460.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    duration: '14 hrs',
    students: '19.1K',
    rating: 4.7,
    price: 'Free',
    tags: ['SQL', 'PostgreSQL'],
    category: 'Data',
  },
];

const filters = ['All', 'Python', 'AI', 'Data'];

export default function Courses() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? courses : courses.filter((c) => c.category === active);

  return (
    <section id="courses" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-primary-600 tracking-wide uppercase">Courses</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
              Hand-picked courses for every level
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Learn from professors and engineers who have shipped AI products at scale.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === f
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <article
              key={c.title}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      c.price === 'Free'
                        ? 'bg-success-500 text-white'
                        : 'bg-white/90 text-gray-900 backdrop-blur'
                    }`}
                  >
                    {c.price}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {c.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{c.instructor}</p>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {c.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {c.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent-500 fill-accent-500" /> {c.rating}
                  </span>
                </div>

                <a
                  href="#/courses"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-primary-500 hover:text-white transition-all group-hover:bg-primary-500 group-hover:text-white"
                >
                  Browse Courses <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
