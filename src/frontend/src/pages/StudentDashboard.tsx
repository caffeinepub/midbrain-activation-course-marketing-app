import { useGetAllCourses, useGetEnrolledCourses } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CourseList from '../components/CourseList';
import EnrolledCourses from '../components/EnrolledCourses';
import StudentApplicationForm from '../components/StudentApplicationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, GraduationCap, FileText } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function StudentDashboard() {
  const { identity } = useInternetIdentity();
  const { data: allCourses, isLoading: coursesLoading } = useGetAllCourses();
  const { data: enrolledCourses, isLoading: enrolledLoading } = useGetEnrolledCourses(identity?.getPrincipal());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-orange-900 mb-2">Student Dashboard</h2>
        <p className="text-gray-600">Explore courses and track your learning journey</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Courses</p>
              {coursesLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-orange-900">{allCourses?.length || 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              {enrolledLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-green-900">{enrolledCourses?.length || 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining Courses</p>
              {coursesLoading || enrolledLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-blue-900">
                  {(allCourses?.length || 0) - (enrolledCourses?.length || 0)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
          <TabsTrigger value="application">Application Form</TabsTrigger>
        </TabsList>
        <TabsContent value="enrolled" className="mt-6">
          <EnrolledCourses />
        </TabsContent>
        <TabsContent value="available" className="mt-6">
          <CourseList />
        </TabsContent>
        <TabsContent value="application" className="mt-6">
          <StudentApplicationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
