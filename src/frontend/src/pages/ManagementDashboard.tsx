import { useGetAllCourses, useGetAllStudents, useGetAllMarketers } from '../hooks/useQueries';
import CourseManagement from '../components/CourseManagement';
import StudentList from '../components/StudentList';
import AllMarketersView from '../components/AllMarketersView';
import EnrollmentAnalytics from '../components/EnrollmentAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, Users, TrendingUp, Target } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function ManagementDashboard() {
  const { data: courses, isLoading: coursesLoading } = useGetAllCourses();
  const { data: students, isLoading: studentsLoading } = useGetAllStudents();
  const { data: marketers, isLoading: marketersLoading } = useGetAllMarketers();

  const totalEnrollments = students?.reduce((sum, student) => sum + student.enrolledCourses.length, 0) || 0;
  const totalReferrals = marketers?.reduce((sum, marketer) => sum + Number(marketer.referralCount), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-orange-900 mb-2">Management Dashboard</h2>
        <p className="text-gray-600">Oversee courses, students, and marketing performance</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              {coursesLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-orange-900">{courses?.length || 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              {studentsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-blue-900">{students?.length || 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Enrollments</p>
              {studentsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-green-900">{totalEnrollments}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              {marketersLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold text-purple-900">{totalReferrals}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="marketers">Marketers</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="mt-6">
          <EnrollmentAnalytics />
        </TabsContent>
        <TabsContent value="courses" className="mt-6">
          <CourseManagement />
        </TabsContent>
        <TabsContent value="students" className="mt-6">
          <StudentList />
        </TabsContent>
        <TabsContent value="marketers" className="mt-6">
          <AllMarketersView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
