import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { ORG_PRICING } from '@/types/ai-credits';
import { useToast } from '@/hooks/use-toast';
import { Users, ShoppingCart, Download, TrendingUp, AlertCircle, Building } from 'lucide-react';
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
}

export function OrgAdminDashboard() {
  const { organization } = useUser();
  const { purchaseCredits } = useAiCredits();
  const { toast } = useToast();
  
  const [bulkCredits, setBulkCredits] = useState(8000);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
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
      efficiency: 92
    },
    {
      id: 'doc-2',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      department: 'Internal Medicine',
      creditsUsed: 145,
      consultations: 8,
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
      efficiency: 88
    },
    {
      id: 'doc-3',
      name: 'Dr. Emily Davis',
      email: 'emily.davis@hospital.com',
      department: 'Pediatrics',
      creditsUsed: 95,
      consultations: 6,
      lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
      efficiency: 85
    }
  ];

  const minimumBuyIn = organization ? ORG_PRICING.getMinimumBuyIn(organization.doctorCount) : 8000;
  const totalUsage = doctorUsage.reduce((sum, doc) => sum + doc.creditsUsed, 0);
  const averageEfficiency = doctorUsage.reduce((sum, doc) => sum + doc.efficiency, 0) / doctorUsage.length;

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
    const csvContent = [
      ['Doctor Name', 'Email', 'Department', 'Credits Used', 'Consultations', 'Efficiency %', 'Last Active'],
      ...doctorUsage.map(doc => [
        doc.name,
        doc.email,
        doc.department,
        doc.creditsUsed.toString(),
        doc.consultations.toString(),
        doc.efficiency.toString(),
        format(doc.lastActive, 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctor-usage-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
      {/* Organization Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organization</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization.name}</div>
            <p className="text-xs text-muted-foreground">
              {organization.doctorCount} doctors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Credits used this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageEfficiency)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all doctors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minimum Buy-in</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minimumBuyIn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Credits required for org purchase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Purchase Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Organization Credit Purchase
          </CardTitle>
          <CardDescription>
            Purchase credits in bulk for your organization at ₹{ORG_PRICING.pricePerCredit} per credit
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
              />
              {bulkCredits < minimumBuyIn && (
                <p className="text-sm text-destructive">
                  Minimum purchase: {minimumBuyIn.toLocaleString()} credits
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Cost (including GST)</label>
              <div className="text-2xl font-bold">
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
            className="w-full"
          >
            {isLoading ? 'Processing...' : `Purchase ${bulkCredits.toLocaleString()} Credits`}
          </Button>
        </CardContent>
      </Card>

      {/* Doctor Usage Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Doctor Usage Analytics</CardTitle>
              <CardDescription>
                Track credit usage and efficiency across all doctors
              </CardDescription>
            </div>
            <div className="flex gap-2">
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Credits Used</TableHead>
                  <TableHead>Consultations</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Last Active</TableHead>
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
                    <TableCell>{doctor.department}</TableCell>
                    <TableCell className="font-medium">
                      {doctor.creditsUsed.toLocaleString()}
                    </TableCell>
                    <TableCell>{doctor.consultations}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={doctor.efficiency >= 90 ? 'default' : doctor.efficiency >= 80 ? 'secondary' : 'destructive'}
                      >
                        {doctor.efficiency}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(doctor.lastActive, 'MMM dd, HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}