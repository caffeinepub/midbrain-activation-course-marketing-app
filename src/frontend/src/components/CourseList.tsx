import { useGetAllCourses, useGetEnrolledCourses, useEnrollInCourse } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, CheckCircle, Loader2, Clock } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { getCourseImage } from '../utils/courseImages';

export default function CourseList() {
  const { identity } = useInternetIdentity();
  const { data: courses, isLoading: coursesLoading } = useGetAllCourses();
  const { data: enrolledCourses, isLoading: enrolledLoading } = useGetEnrolledCourses(identity?.getPrincipal());
  const enrollMutation = useEnrollInCourse();

  const isEnrolled = (courseId: string) => {
    return enrolledCourses?.some((course) => course.id === courseId) || false;
  };

  // Extract duration info from description
  const extractDurationInfo = (description: string) => {
    const durationMatch = description.match(/Duration:\s*([^,]+)/i);
    const hoursMatch = description.match(/(\d+\+?\s*hours?)[^.]*daily/i);
    return {
      duration: durationMatch ? durationMatch[1].trim() : null,
      dailyHours: hoursMatch ? hoursMatch[1].trim() : null,
    };
  };

  if (coursesLoading || enrolledLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">No courses available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const enrolled = isEnrolled(course.id);
        const { duration, dailyHours } = extractDurationInfo(course.description);
        const isAdultCourse = course.name.includes('18+');

        return (
          <Card key={course.id} className="border-orange-200 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
              <img
                src={getCourseImage(course.id)}
                alt={course.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-orange-900">{course.name}</CardTitle>
                <div className="flex flex-col gap-1">
                  {enrolled && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Enrolled
                    </Badge>
                  )}
                  {isAdultCourse && (
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                      18+
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(duration || dailyHours) && (
                  <div className="flex items-start gap-2 text-sm bg-orange-50 p-3 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      {duration && (
                        <p className="font-semibold text-orange-900">Duration: {duration}</p>
                      )}
                      {dailyHours && (
                        <p className="text-gray-600">{dailyHours} daily</p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>Course ID: {course.id}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => enrollMutation.mutate(course.id)}
                disabled={enrolled || enrollMutation.isPending}
                className={enrolled ? 'w-full' : 'w-full bg-orange-600 hover:bg-orange-700'}
                variant={enrolled ? 'outline' : 'default'}
              >
                {enrollMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enrolling...
                  </>
                ) : enrolled ? (
                  'Already Enrolled'
                ) : (
                  'Enroll Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
