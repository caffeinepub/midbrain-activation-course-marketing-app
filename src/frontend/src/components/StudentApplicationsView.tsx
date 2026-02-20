import { useGetAllStudentApplications } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { FileText, Users } from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';

export default function StudentApplicationsView() {
  const { data: applications, isLoading } = useGetAllStudentApplications();
  const [searchTerm, setSearchTerm] = useState('');

  // Parse contact info to extract structured data
  const parseContactInfo = (contactInfo: string) => {
    try {
      return JSON.parse(contactInfo);
    } catch {
      return { fatherName: 'N/A', city: 'N/A', age: 'N/A', contactNumber: contactInfo };
    }
  };

  // Filter applications based on search term
  const filteredApplications = applications?.filter((app) => {
    const [, application] = app;
    const contactData = parseContactInfo(application.contactInfo);
    const searchLower = searchTerm.toLowerCase();
    return (
      application.name.toLowerCase().includes(searchLower) ||
      contactData.fatherName.toLowerCase().includes(searchLower) ||
      contactData.city.toLowerCase().includes(searchLower) ||
      application.courseSelected.toLowerCase().includes(searchLower) ||
      (application.referredBy && application.referredBy.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{applications?.length || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Applications received</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{applications?.length || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">All Applications</CardTitle>
          <CardDescription>Review and manage student applications</CardDescription>
          <div className="pt-4">
            <Input
              placeholder="Search by name, father name, city, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md border-orange-200"
            />
          </div>
        </CardHeader>
        <CardContent>
          {!filteredApplications || filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No applications match your search' : 'No applications received yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Father Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Referred By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map(([id, application]) => {
                    const contactData = parseContactInfo(application.contactInfo);
                    return (
                      <TableRow key={id.toString()}>
                        <TableCell className="font-medium">#{id.toString()}</TableCell>
                        <TableCell className="font-medium">{application.name}</TableCell>
                        <TableCell>{contactData.fatherName}</TableCell>
                        <TableCell>{contactData.city}</TableCell>
                        <TableCell>{contactData.age}</TableCell>
                        <TableCell>{contactData.contactNumber}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              application.courseSelected === 'basic'
                                ? 'border-blue-300 text-blue-700'
                                : application.courseSelected === 'advanced'
                                  ? 'border-orange-300 text-orange-700'
                                  : 'border-purple-300 text-purple-700'
                            }
                          >
                            {application.courseSelected === 'basic'
                              ? 'Basic'
                              : application.courseSelected === 'advanced'
                                ? 'Advanced'
                                : 'Super'}
                          </Badge>
                        </TableCell>
                        <TableCell>{application.referredBy || '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
