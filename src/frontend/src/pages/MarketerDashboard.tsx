import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMarketerStats, useTrackMarketerReferral } from '../hooks/useQueries';
import MarketerStats from '../components/MarketerStats';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Target, TrendingUp, Users, Loader2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function MarketerDashboard() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: stats, isLoading } = useGetMarketerStats(principal);
  const trackReferral = useTrackMarketerReferral();

  const [name, referralCount] = stats || ['Unknown', BigInt(0)];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-orange-900 mb-2">Marketer Dashboard</h2>
        <p className="text-gray-600">Track your referrals and marketing performance</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold text-purple-900">{Number(referralCount)}</p>
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
              <p className="text-sm text-gray-600">Performance</p>
              <p className="text-2xl font-bold text-green-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : Number(referralCount) > 0 ? 'Active' : 'Getting Started'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Marketer Name</p>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-lg font-bold text-blue-900 truncate">{name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-900">Track New Referral</CardTitle>
            <CardDescription>Record a new student referral to increase your count</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => trackReferral.mutate()}
              disabled={trackReferral.isPending}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {trackReferral.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Track Referral
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <MarketerStats />
      </div>
    </div>
  );
}
