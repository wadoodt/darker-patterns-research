'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, LineChart, PieChart, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto py-2">
      <div className="mb-8">
        <h1 className="font-headline text-foreground text-4xl font-bold">
          Welcome, <span className="text-primary">{profile?.displayName || 'Admin'}</span>!
        </h1>
        <p className="text-muted-foreground text-lg">Here&apos;s an overview of the Dark Pattern Validator.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <BarChart className="text-primary h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-3xl font-bold">1,234</div>
            <p className="text-muted-foreground text-xs">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="text-accent h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-3xl font-bold">258</div>
            <p className="text-muted-foreground text-xs">+15 since last week</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patterns Identified</CardTitle>
            <AlertTriangle className="text-destructive h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-3xl font-bold">78</div>
            <p className="text-muted-foreground text-xs">Across 12 categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="shadow-lg lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Submission Trends</CardTitle>
            <CardDescription>Monthly submissions over the last year.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder for chart */}
            <div className="bg-muted/50 flex h-[350px] w-full items-center justify-center rounded-md">
              <LineChart className="text-muted-foreground h-16 w-16" />
              <p className="text-muted-foreground ml-4">Chart data would be displayed here.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Pattern Distribution</CardTitle>
            <CardDescription>Breakdown of identified dark patterns by type.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {/* Placeholder for chart */}
            <div className="bg-muted/50 flex h-[350px] w-full items-center justify-center rounded-md">
              <PieChart className="text-muted-foreground h-16 w-16" />
              <p className="text-muted-foreground ml-4">Pie chart of patterns.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="bg-muted/30 flex items-center space-x-3 rounded-md p-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-foreground font-medium">New submission #1235 approved.</p>
                <p className="text-muted-foreground text-xs">2 hours ago by @researcher_jane</p>
              </div>
            </li>
            <li className="bg-muted/30 flex items-center space-x-3 rounded-md p-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-foreground font-medium">Pattern "Roach Motel" definition updated.</p>
                <p className="text-muted-foreground text-xs">5 hours ago by @admin_mike</p>
              </div>
            </li>
            <li className="bg-muted/30 flex items-center space-x-3 rounded-md p-3">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-foreground font-medium">New user "contributor_sam" registered.</p>
                <p className="text-muted-foreground text-xs">1 day ago</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
