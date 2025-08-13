import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { useUser } from '@/contexts/UserContext';
import { CreditPurchaseDialog } from '@/components/ai-credits/CreditPurchaseDialog';
import { UsageAnalytics } from '@/components/ai-credits/UsageAnalytics';
import { ActivityTable } from '@/components/ai-credits/ActivityTable';
import { RecentActivityTable } from '@/components/ai-credits/RecentActivityTable';
import { AutoRefillSettings } from '@/components/ai-credits/AutoRefillSettings';
import { OrgAdminDashboard } from '@/components/ai-credits/OrgAdminDashboard';
import { CreditCard, TrendingUp, Calendar, Settings, Building2, Activity, Zap, Shield, Target, Download } from 'lucide-react';

export default function AiCreditsPage() {
  const { balance, usage, isLoading } = useAiCredits();
  const { user, isOrgAdmin } = useUser();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalCredits = balance.free + balance.individual + balance.organization;
  const estimatedDaysLeft = totalCredits > 0 ? Math.floor(totalCredits / 25) : 0;
  
  // Get today's usage
  const today = new Date().toDateString();
  const todayUsage = usage.filter(u => new Date(u.date).toDateString() === today);
  const todayCreditsUsed = todayUsage.reduce((sum, u) => sum + u.creditsUsed, 0);

  // Filter activity based on selection
  const filteredUsage = activityFilter === 'today' 
    ? todayUsage 
    : activityFilter === 'week'
    ? usage.filter(u => {
        const usageDate = new Date(u.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return usageDate >= weekAgo;
      })
    : usage;

  // Pagination
  const totalPages = Math.ceil(filteredUsage.length / itemsPerPage);
  const paginatedUsage = filteredUsage.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getCreditSourceColor = (source: string) => {
    switch (source) {
      case 'free': return 'bg-credits-free text-credits-free-foreground';
      case 'individual': return 'bg-credits-individual text-credits-individual-foreground';
      case 'organization': return 'bg-credits-organization text-credits-organization-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getBalanceStatus = (balance: number) => {
    if (balance <= 50) return { color: 'text-credits-danger', bg: 'bg-credits-danger/10', status: 'Low' };
    if (balance <= 200) return { color: 'text-credits-warning', bg: 'bg-credits-warning/10', status: 'Medium' };
    return { color: 'text-credits-success', bg: 'bg-credits-success/10', status: 'Healthy' };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-credits-individual to-credits-organization flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            AI Credits Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI consultation credits and track usage insights
          </p>
        </div>
            <div className="flex gap-2">
              {user?.role === "org_admin" && (
                <Button variant="outline" asChild>
                  <Link to="/ai-credits/organization" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Organization Dashboard
                  </Link>
                </Button>
              )}
              <Button 
                onClick={() => setPurchaseDialogOpen(true)}
                className="bg-gradient-to-r from-credits-individual to-credits-organization hover:opacity-90 text-white shadow-lg"
                size="lg"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Buy Credits
              </Button>
            </div>
      </div>

      {/* Enhanced Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-credits-free bg-gradient-to-br from-credits-free/5 to-transparent hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Free Credits</CardTitle>
              <Shield className="w-4 h-4 text-credits-free" />
            </div>
            <div className="text-3xl font-bold text-credits-free">{balance.free.toLocaleString()}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Resets monthly</span>
              </div>
              {user?.isElitePlan && <Badge variant="secondary" className="text-xs">Elite Plan</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-credits-individual bg-gradient-to-br from-credits-individual/5 to-transparent hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Individual Credits</CardTitle>
              <Target className="w-4 h-4 text-credits-individual" />
            </div>
            <div className="text-3xl font-bold text-credits-individual">{balance.individual.toLocaleString()}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Personal balance</span>
              </div>
              <Badge className={getBalanceStatus(balance.individual).bg + ' ' + getBalanceStatus(balance.individual).color}>
                {getBalanceStatus(balance.individual).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-credits-organization bg-gradient-to-br from-credits-organization/5 to-transparent hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organization Credits</CardTitle>
              <Building2 className="w-4 h-4 text-credits-organization" />
            </div>
            <div className="text-3xl font-bold text-credits-organization">{balance.organization.toLocaleString()}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span>Shared pool</span>
              </div>
              <Badge className={getBalanceStatus(balance.organization).bg + ' ' + getBalanceStatus(balance.organization).color}>
                {getBalanceStatus(balance.organization).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Usage</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary">{todayCreditsUsed}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{todayUsage.length} consultations</span>
              </div>
              <Badge variant="outline">{Math.round((todayCreditsUsed / 25) * 100)}% of avg</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats with Progress */}
      <Card className="bg-gradient-to-r from-background to-muted/20 hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Usage Overview
          </CardTitle>
          <CardDescription>Your current credit status and projected usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Total Credits Available</span>
                  <span className="font-semibold">{totalCredits.toLocaleString()}</span>
                </div>
                <Progress value={Math.min((totalCredits / 1000) * 100, 100)} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Estimated days left</span>
                  <div className="font-bold text-2xl text-primary">{estimatedDaysLeft}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Avg daily usage</span>
                  <div className="font-bold text-2xl text-primary">25</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">QUICK ACTIONS</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={() => setPurchaseDialogOpen(true)}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy More
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Usage
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unified Activity Feed */}
      <Card className="hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Track your AI credit usage and consultations</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedUsage.length > 0 ? (
              <>
                {paginatedUsage.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <div className="font-medium">{item.feature}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.patientName && `Patient: ${item.patientName} • `}
                          {new Date(item.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getCreditSourceColor(item.source)}>
                        {item.source}
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold">{item.creditsUsed} credits</div>
                        <div className="text-xs text-muted-foreground">Dr. {item.doctor}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsage.length)} of {filteredUsage.length} records
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-3 text-sm">{currentPage} of {totalPages}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No activity found for the selected period.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
          {isOrgAdmin && (
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organization
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="analytics">
          <UsageAnalytics />
        </TabsContent>

        <TabsContent value="settings">
          <AutoRefillSettings />
        </TabsContent>

        {isOrgAdmin && (
          <TabsContent value="organization">
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