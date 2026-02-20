import { useGetEnrolledCourses } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, GraduationCap } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { getCourseImage } from '../utils/courseImages';

export default function EnrolledCourses() {
  const { identity } = useInternetIdentity();
  const { data: courses, isLoading } = useGetEnrolledCourses(identity?.getPrincipal());

  if (isLoading) {
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
          <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">You haven't enrolled in any courses yet.</p>
          <p className="text-sm text-gray-500">Browse available courses to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="border-green-200 hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
            <img
              src={getCourseImage(course.id)}
              alt={course.name}
              className="h-full w-full object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-green-900">{course.name}</CardTitle>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
            </div>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>Course ID: {course.id}</span>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-sm font-medium text-green-900">Enrollment Status</p>
                <p className="text-xs text-green-700 mt-1">You are enrolled in this course</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
