import { useGetAllCourses, useGetAllStudents } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { BookOpen, Users } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export default function CourseManagement() {
  const { data: courses, isLoading: coursesLoading } = useGetAllCourses();
  const { data: students, isLoading: studentsLoading } = useGetAllStudents();

  const getEnrollmentCount = (courseId: string) => {
    if (!students) return 0;
    return students.filter((student) => student.enrolledCourses.includes(courseId)).length;
  };

  if (coursesLoading || studentsLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">No courses available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-900">Course Management</CardTitle>
        <CardDescription>Overview of all courses and their enrollment statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Enrollments</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const enrollmentCount = getEnrollmentCount(course.id);
              return (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell className="max-w-md">{course.description}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{enrollmentCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={enrollmentCount > 0 ? 'default' : 'outline'}>
                      {enrollmentCount > 0 ? 'Active' : 'No Enrollments'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
