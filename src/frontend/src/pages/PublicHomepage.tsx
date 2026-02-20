import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, BookOpen, Brain, Sparkles, Target } from 'lucide-react';
import { getCourseImage } from '../utils/courseImages';

export default function PublicHomepage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  const courses = [
    {
      id: 'basic',
      name: 'Basic Midbrain Activation Course',
      description: 'Introduction to midbrain activation techniques.',
      highlights: ['Foundation concepts', 'Basic exercises', 'Beginner-friendly approach'],
    },
    {
      id: 'advanced',
      name: 'Advanced Midbrain Activation Course',
      description: 'Advanced concepts and practices in midbrain activation.',
      highlights: ['Deep techniques', 'Advanced practices', 'Enhanced cognitive skills'],
    },
    {
      id: 'super',
      name: 'Super Advanced Intuition Course',
      description: 'Comprehensive course on developing intuition through midbrain activation.',
      highlights: ['Master-level training', 'Intuition development', 'Complete transformation'],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/brain-icon.dim_256x256.png" alt="Brain Icon" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-orange-900">Midbrain Academy</h1>
          </div>
          <Button onClick={login} disabled={isLoggingIn} className="bg-orange-600 hover:bg-orange-700">
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="Midbrain Activation"
              className="mx-auto mb-8 rounded-2xl shadow-2xl max-w-full"
            />
            <h2 className="mb-4 text-4xl font-bold text-orange-900 md:text-5xl">
              Unlock Your Mind's Potential
            </h2>
            <p className="mb-8 text-xl text-gray-700 max-w-3xl mx-auto">
              Discover the power of midbrain activation through our comprehensive courses designed to enhance
              intuition, creativity, and cognitive abilities.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Brain className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle className="text-orange-900">Brain Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Scientifically designed programs to activate and enhance your midbrain functions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle className="text-orange-900">Intuition Enhancement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Develop your natural intuitive abilities through proven activation techniques.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Target className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle className="text-orange-900">Personalized Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Courses tailored to your level, from beginner to advanced practitioner.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="px-4 py-12 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-orange-900 mb-4">Our Courses</h3>
            <p className="text-lg text-gray-700">
              Choose the perfect course for your journey to enhanced cognitive abilities
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="border-orange-200 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
              >
                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
                  <img
                    src={getCourseImage(course.id)}
                    alt={course.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-orange-900 text-xl">{course.name}</CardTitle>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <BookOpen className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="border-orange-300 bg-gradient-to-br from-orange-100 to-amber-100 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-900">Ready to Begin Your Journey?</CardTitle>
                <CardDescription className="text-base text-gray-700">
                  Login to enroll in courses and start your transformation today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={login}
                  disabled={isLoggingIn}
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-lg px-8"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Get Started Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-200 bg-white/80 backdrop-blur-sm py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-orange-900 mb-2">Management Team</h4>
            <p className="text-gray-700">Aruna Mahajan & Mahesh Gujrati</p>
            <p className="text-gray-600 mt-2">
              Contact us on WhatsApp:{' '}
              <a href="https://wa.me/917330202733" className="text-orange-600 hover:text-orange-700 font-medium">
                +91 7330202733
              </a>
            </p>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Midbrain Academy. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
