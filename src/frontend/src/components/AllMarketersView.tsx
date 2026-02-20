import { useGetAllMarketers } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Target, TrendingUp } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export default function AllMarketersView() {
  const { data: marketers, isLoading } = useGetAllMarketers();

  const sortedMarketers = marketers
    ? [...marketers].sort((a, b) => Number(b.referralCount) - Number(a.referralCount))
    : [];

  if (isLoading) {
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

  if (!marketers || marketers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">No marketers registered yet.</p>
        </CardContent>
      </Card>
    );
  }

  const totalReferrals = marketers.reduce((sum, m) => sum + Number(m.referralCount), 0);
  const topPerformer = sortedMarketers[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Marketers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{marketers.length}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalReferrals}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-900 truncate">
              {topPerformer?.name || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              {topPerformer ? `${Number(topPerformer.referralCount)} referrals` : ''}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-orange-900">Marketer Performance</CardTitle>
          <CardDescription>Track all marketing representatives and their referral statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Marketer Name</TableHead>
                <TableHead className="text-center">Referrals</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMarketers.map((marketer, index) => {
                const referralCount = Number(marketer.referralCount);
                return (
                  <TableRow key={marketer.principal.toString()}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {index === 0 && <TrendingUp className="h-4 w-4 text-yellow-600" />}
                        <span className="font-semibold">#{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{marketer.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                        {referralCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={referralCount >= 10 ? 'default' : referralCount >= 5 ? 'secondary' : 'outline'}
                      >
                        {referralCount >= 10 ? 'Excellent' : referralCount >= 5 ? 'Good' : 'Getting Started'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
