import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { useUser } from '@/contexts/UserContext';
import { CreditPurchaseDialog } from '@/components/ai-credits/CreditPurchaseDialog';
import { UsageAnalytics } from '@/components/ai-credits/UsageAnalytics';
import { ActivityTable } from '@/components/ai-credits/ActivityTable';
import { AutoRefillSettings } from '@/components/ai-credits/AutoRefillSettings';
import { OrgAdminDashboard } from '@/components/ai-credits/OrgAdminDashboard';
import { Coins, TrendingUp, Clock, Settings } from 'lucide-react';

export default function AiCreditsPage() {
  const { balance, isLoading } = useAiCredits();
  const { user, isOrgAdmin } = useUser();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

  const totalCredits = balance.free + balance.individual + balance.organization;
  const estimatedDaysLeft = Math.floor(totalCredits / 30); // Mock calculation based on average usage

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Credits</h1>
          <p className="text-muted-foreground">
            Manage your AI consultation credits and track usage
          </p>
        </div>
        <Button onClick={() => setPurchaseDialogOpen(true)} size="lg">
          <Coins className="mr-2 h-4 w-4" />
          Buy Credits
        </Button>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Credits</CardTitle>
            <Badge variant={user?.isElitePlan ? "default" : "secondary"}>
              {user?.isElitePlan ? "Elite" : "Basic"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.free.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {user?.isElitePlan ? "Resets monthly" : "Upgrade to Elite for free credits"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Individual Credits</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.individual.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Your personal credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organization Credits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.organization.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {balance.organization > 0 ? "Shared pool credits" : "Not part of organization"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Days Left</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estimatedDaysLeft}</div>
            <p className="text-xs text-muted-foreground">Based on current usage</p>
            <Progress value={(estimatedDaysLeft / 30) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          {isOrgAdmin && <TabsTrigger value="organization">Organization</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <UsageAnalytics />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityTable />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AutoRefillSettings />
        </TabsContent>

        {isOrgAdmin && (
          <TabsContent value="organization" className="space-y-4">
            <OrgAdminDashboard />
          </TabsContent>
        )}
      </Tabs>

      <CreditPurchaseDialog 
        open={purchaseDialogOpen} 
        onOpenChange={setPurchaseDialogOpen} 
      />
    </div>
  );
}