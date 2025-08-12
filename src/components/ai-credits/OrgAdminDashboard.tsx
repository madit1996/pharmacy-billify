import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { ORG_PRICING } from '@/types/ai-credits';
import { useToast } from '@/hooks/use-toast';
import { Users, ShoppingCart, Download, TrendingUp, AlertCircle, Building, BarChart3, PieChart, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DoctorUsage {
  id: string;
  name: string;
  email: string;
  department: string;
  creditsUsed: number;
  consultations: number;
  lastActive: Date;
  efficiency: number;
  allocatedCredits?: number;
}

interface DepartmentStats {
  name: string;
  doctors: number;
  creditsUsed: number;
  budget: number;
  efficiency: number;
}

export function OrgAdminDashboard() {
  const { organization } = useUser();
  const { purchaseCredits } = useAiCredits();
  const { toast } = useToast();
  
  const [bulkCredits, setBulkCredits] = useState(8000);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [viewMode, setViewMode] = useState<'doctor' | 'department'>('doctor');
  const [isLoading, setIsLoading] = useState(false);

  // Mock doctor usage data
  const doctorUsage: DoctorUsage[] = [
    {
      id: 'doc-1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      department: 'Cardiology',
      creditsUsed: 180,
      consultations: 12,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      efficiency: 92,
      allocatedCredits: 500
    },
    {
      id: 'doc-2',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      department: 'Internal Medicine',
      creditsUsed: 145,
      consultations: 8,
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
      efficiency: 88,
      allocatedCredits: 400
    },
    {
      id: 'doc-3',
      name: 'Dr. Emily Davis',
      email: 'emily.davis@hospital.com',
      department: 'Pediatrics',
      creditsUsed: 95,
      consultations: 6,
      lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
      efficiency: 85,
      allocatedCredits: 300
    },
    {
      id: 'doc-4',
      name: 'Dr. James Wilson',
      email: 'james.wilson@hospital.com',
      department: 'Cardiology',
      creditsUsed: 220,
      consultations: 15,
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
      efficiency: 94,
      allocatedCredits: 600
    },
    {
      id: 'doc-5',
      name: 'Dr. Lisa Brown',
      email: 'lisa.brown@hospital.com',
      department: 'Internal Medicine',
      creditsUsed: 160,
      consultations: 10,
      lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
      efficiency: 89,
      allocatedCredits: 450
    }
  ];

  // Calculate department stats
  const departmentStats: DepartmentStats[] = [
    {
      name: 'Cardiology',
      doctors: doctorUsage.filter(d => d.department === 'Cardiology').length,
      creditsUsed: doctorUsage.filter(d => d.department === 'Cardiology').reduce((sum, d) => sum + d.creditsUsed, 0),
      budget: 1500,
      efficiency: doctorUsage.filter(d => d.department === 'Cardiology').reduce((sum, d) => sum + d.efficiency, 0) / doctorUsage.filter(d => d.department === 'Cardiology').length
    },
    {
      name: 'Internal Medicine',
      doctors: doctorUsage.filter(d => d.department === 'Internal Medicine').length,
      creditsUsed: doctorUsage.filter(d => d.department === 'Internal Medicine').reduce((sum, d) => sum + d.creditsUsed, 0),
      budget: 1200,
      efficiency: doctorUsage.filter(d => d.department === 'Internal Medicine').reduce((sum, d) => sum + d.efficiency, 0) / doctorUsage.filter(d => d.department === 'Internal Medicine').length
    },
    {
      name: 'Pediatrics',
      doctors: doctorUsage.filter(d => d.department === 'Pediatrics').length,
      creditsUsed: doctorUsage.filter(d => d.department === 'Pediatrics').reduce((sum, d) => sum + d.creditsUsed, 0),
      budget: 800,
      efficiency: doctorUsage.filter(d => d.department === 'Pediatrics').reduce((sum, d) => sum + d.efficiency, 0) / doctorUsage.filter(d => d.department === 'Pediatrics').length
    }
  ];

  const minimumBuyIn = organization ? ORG_PRICING.getMinimumBuyIn(organization.doctorCount) : 8000;
  const totalUsage = doctorUsage.reduce((sum, doc) => sum + doc.creditsUsed, 0);
  const averageEfficiency = doctorUsage.reduce((sum, doc) => sum + doc.efficiency, 0) / doctorUsage.length;
  const totalAllocated = doctorUsage.reduce((sum, doc) => sum + (doc.allocatedCredits || 0), 0);

  const handleBulkPurchase = async () => {
    if (bulkCredits < minimumBuyIn) {
      toast({
        title: "Minimum Purchase Required",
        description: `Organization purchases require a minimum of ${minimumBuyIn.toLocaleString()} credits.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await purchaseCredits(bulkCredits, 'organization');
      toast({
        title: "Bulk Purchase Successful",
        description: `${bulkCredits.toLocaleString()} credits have been added to your organization pool.`
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your bulk purchase. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportUsageData = () => {
    const data = viewMode === 'doctor' ? doctorUsage : departmentStats;
    const headers = viewMode === 'doctor' 
      ? ['Doctor Name', 'Email', 'Department', 'Credits Used', 'Consultations', 'Efficiency %', 'Allocated Credits', 'Last Active']
      : ['Department', 'Doctors', 'Credits Used', 'Budget', 'Efficiency %'];
    
    const csvContent = [
      headers,
      ...data.map(item => 
        viewMode === 'doctor' 
          ? [
              (item as DoctorUsage).name,
              (item as DoctorUsage).email,
              (item as DoctorUsage).department,
              (item as DoctorUsage).creditsUsed.toString(),
              (item as DoctorUsage).consultations.toString(),
              (item as DoctorUsage).efficiency.toString(),
              ((item as DoctorUsage).allocatedCredits || 0).toString(),
              format((item as DoctorUsage).lastActive, 'yyyy-MM-dd HH:mm')
            ]
          : [
              (item as DepartmentStats).name,
              (item as DepartmentStats).doctors.toString(),
              (item as DepartmentStats).creditsUsed.toString(),
              (item as DepartmentStats).budget.toString(),
              (item as DepartmentStats).efficiency.toFixed(1)
            ]
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewMode}-usage-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!organization) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Organization Found</h3>
          <p className="text-muted-foreground">
            You need to be part of an organization to access admin features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Organization Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-credits-organization bg-gradient-to-br from-credits-organization/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organization</CardTitle>
            <Building className="h-4 w-4 text-credits-organization" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization.name}</div>
            <p className="text-xs text-muted-foreground">
              {organization.doctorCount} doctors
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Credits used this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-credits-success bg-gradient-to-br from-credits-success/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <Users className="h-4 w-4 text-credits-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageEfficiency)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all doctors
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-credits-warning bg-gradient-to-br from-credits-warning/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocated Credits</CardTitle>
            <Target className="h-4 w-4 text-credits-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total allocated to doctors
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-muted bg-gradient-to-br from-muted/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Min Buy-in</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minimumBuyIn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Credits for org purchase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Bulk Purchase Section */}
      <Card className="border-l-4 border-l-credits-individual bg-gradient-to-br from-credits-individual/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-credits-individual" />
            Enterprise Credit Purchase
          </CardTitle>
          <CardDescription>
            Purchase credits in bulk for your organization at ₹{ORG_PRICING.pricePerCredit} per credit with no quick packs - enterprise pricing only
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Credits</label>
              <Input
                type="number"
                value={bulkCredits}
                onChange={(e) => setBulkCredits(parseInt(e.target.value) || 0)}
                min={minimumBuyIn}
                placeholder={`Minimum ${minimumBuyIn.toLocaleString()}`}
                className="text-lg"
              />
              {bulkCredits < minimumBuyIn && (
                <p className="text-sm text-credits-danger">
                  Minimum purchase: {minimumBuyIn.toLocaleString()} credits
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Cost (including GST)</label>
              <div className="text-3xl font-bold text-credits-individual">
                ₹{(bulkCredits * ORG_PRICING.pricePerCredit * 1.18).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Subtotal: ₹{(bulkCredits * ORG_PRICING.pricePerCredit).toLocaleString()} + 18% GST
              </p>
            </div>
          </div>

          <Button 
            onClick={handleBulkPurchase} 
            disabled={isLoading || bulkCredits < minimumBuyIn}
            size="lg"
            className="w-full bg-gradient-to-r from-credits-individual to-credits-organization hover:opacity-90 text-white"
          >
            {isLoading ? 'Processing...' : `Purchase ${bulkCredits.toLocaleString()} Credits`}
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Analytics with View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Usage Analytics & Credit Management
              </CardTitle>
              <CardDescription>
                Comprehensive insights into credit usage across your organization
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={viewMode} onValueChange={(value: 'doctor' | 'department') => setViewMode(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">By Doctor</SelectItem>
                  <SelectItem value="department">By Department</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportUsageData} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'doctor' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Credits Used</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Consultations</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorUsage.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doctor.department}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{doctor.creditsUsed.toLocaleString()}</span>
                          <div className="w-16 h-2 bg-muted rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min((doctor.creditsUsed / (doctor.allocatedCredits || 500)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.allocatedCredits?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell>{doctor.consultations}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            doctor.efficiency >= 90 
                              ? 'bg-credits-success text-credits-success-foreground' 
                              : doctor.efficiency >= 80 
                              ? 'bg-credits-warning text-credits-warning-foreground' 
                              : 'bg-credits-danger text-credits-danger-foreground'
                          }
                        >
                          {doctor.efficiency}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(doctor.lastActive, 'MMM dd, HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Target className="w-3 h-3 mr-1" />
                          Allocate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Doctors</TableHead>
                    <TableHead>Credits Used</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Budget Usage</TableHead>
                    <TableHead>Avg Efficiency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentStats.map((dept) => (
                    <TableRow key={dept.name}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.doctors}</TableCell>
                      <TableCell className="font-medium">{dept.creditsUsed.toLocaleString()}</TableCell>
                      <TableCell>{dept.budget.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{Math.round((dept.creditsUsed / dept.budget) * 100)}%</span>
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div 
                              className={`h-full rounded-full ${
                                (dept.creditsUsed / dept.budget) > 0.8 
                                  ? 'bg-credits-danger' 
                                  : (dept.creditsUsed / dept.budget) > 0.6 
                                  ? 'bg-credits-warning' 
                                  : 'bg-credits-success'
                              }`}
                              style={{ width: `${Math.min((dept.creditsUsed / dept.budget) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            dept.efficiency >= 90 
                              ? 'bg-credits-success text-credits-success-foreground' 
                              : dept.efficiency >= 80 
                              ? 'bg-credits-warning text-credits-warning-foreground' 
                              : 'bg-credits-danger text-credits-danger-foreground'
                          }
                        >
                          {dept.efficiency.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          Set Budget
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}