import { useGetAllStudents, useGetAllCourses } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Users, BookOpen } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useState } from 'react';
import { Input } from './ui/input';

export default function StudentList() {
  const { data: students, isLoading: studentsLoading } = useGetAllStudents();
  const { data: courses, isLoading: coursesLoading } = useGetAllCourses();
  const [searchTerm, setSearchTerm] = useState('');

  const getCourseName = (courseId: string) => {
    return courses?.find((c) => c.id === courseId)?.name || courseId;
  };

  const filteredStudents = students?.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (studentsLoading || coursesLoading) {
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

  if (!students || students.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">No students enrolled yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-900">Student Management</CardTitle>
        <CardDescription>View all enrolled students and their course selections</CardDescription>
        <div className="pt-4">
          <Input
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Enrolled Courses</TableHead>
              <TableHead className="text-center">Total Enrollments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents?.map((student) => (
              <TableRow key={student.principal.toString()}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {student.enrolledCourses.length > 0 ? (
                      student.enrolledCourses.map((courseId) => (
                        <Badge key={courseId} variant="outline" className="border-orange-300">
                          <BookOpen className="mr-1 h-3 w-3" />
                          {getCourseName(courseId)}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No enrollments</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {student.enrolledCourses.length}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
