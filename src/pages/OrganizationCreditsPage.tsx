import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/contexts/UserContext';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  PlusCircle,
  BarChart3,
  UserCog,
  Coins,
  Target,
  Activity,
  Download,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

interface DoctorAllocation {
  id: string;
  name: string;
  department: string;
  allocated: number;
  used: number;
  efficiency: number;
  lastUsed: Date;
}

interface DepartmentAllocation {
  id: string;
  name: string;
  allocated: number;
  used: number;
  doctorCount: number;
  efficiency: number;
  avgUsagePerDoctor: number;
}

export default function OrganizationCreditsPage() {
  const { user, organization } = useUser();
  const { balance } = useAiCredits();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [allocateDialogOpen, setAllocateDialogOpen] = useState(false);
  const [allocationType, setAllocationType] = useState<'doctor' | 'department'>('doctor');

  // Mock data for allocations
  const [doctorAllocations] = useState<DoctorAllocation[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      allocated: 200,
      used: 145,
      efficiency: 87,
      lastUsed: new Date(2024, 0, 15, 14, 30)
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      department: 'Neurology',
      allocated: 150,
      used: 89,
      efficiency: 92,
      lastUsed: new Date(2024, 0, 15, 10, 15)
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      department: 'Pediatrics',
      allocated: 180,
      used: 156,
      efficiency: 76,
      lastUsed: new Date(2024, 0, 15, 16, 45)
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      department: 'Orthopedics',
      allocated: 120,
      used: 98,
      efficiency: 94,
      lastUsed: new Date(2024, 0, 15, 9, 20)
    },
    {
      id: '5',
      name: 'Dr. Lisa Thompson',
      department: 'Dermatology',
      allocated: 100,
      used: 67,
      efficiency: 89,
      lastUsed: new Date(2024, 0, 15, 13, 10)
    }
  ]);

  const [departmentAllocations] = useState<DepartmentAllocation[]>([
    {
      id: '1',
      name: 'Cardiology',
      allocated: 400,
      used: 298,
      doctorCount: 6,
      efficiency: 91,
      avgUsagePerDoctor: 49.7
    },
    {
      id: '2',
      name: 'Neurology',
      allocated: 350,
      used: 234,
      doctorCount: 4,
      efficiency: 85,
      avgUsagePerDoctor: 58.5
    },
    {
      id: '3',
      name: 'Pediatrics',
      allocated: 300,
      used: 267,
      doctorCount: 5,
      efficiency: 78,
      avgUsagePerDoctor: 53.4
    },
    {
      id: '4',
      name: 'Emergency',
      allocated: 500,
      used: 445,
      doctorCount: 8,
      efficiency: 88,
      avgUsagePerDoctor: 55.6
    }
  ]);

  const totalAllocated = doctorAllocations.reduce((sum, doc) => sum + doc.allocated, 0);
  const totalUsed = doctorAllocations.reduce((sum, doc) => sum + doc.used, 0);
  const unallocatedCredits = balance.organization - totalAllocated;
  const overallEfficiency = Math.round((totalUsed / totalAllocated) * 100);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (efficiency >= 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getUsageColor = (used: number, allocated: number) => {
    const percentage = (used / allocated) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const handleAllocateCredits = () => {
    toast({
      title: "Credits Allocated",
      description: "Credit allocation has been updated successfully.",
    });
    setAllocateDialogOpen(false);
  };

  if (user?.role !== "org_admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            Only organization administrators can access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Organization AI Credits
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage and monitor AI credit usage across {organization?.name}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={allocateDialogOpen} onOpenChange={setAllocateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Allocate Credits
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Allocate Credits</DialogTitle>
                  <DialogDescription>
                    Assign organization credits to doctors or departments
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="allocation-type">Allocation Type</Label>
                    <Select value={allocationType} onValueChange={(value: 'doctor' | 'department') => setAllocationType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Individual Doctor</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target">
                      {allocationType === 'doctor' ? 'Select Doctor' : 'Select Department'}
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allocationType === 'doctor' ? (
                          doctorAllocations.map(doc => (
                            <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                          ))
                        ) : (
                          departmentAllocations.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits to Allocate</Label>
                    <Input
                      id="credits"
                      type="number"
                      placeholder="Enter amount"
                      min="1"
                      max={unallocatedCredits}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: {unallocatedCredits.toLocaleString()} credits
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAllocateCredits} className="flex-1">
                      Allocate Credits
                    </Button>
                    <Button variant="outline" onClick={() => setAllocateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Total Organization Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {balance.organization.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {unallocatedCredits.toLocaleString()} unallocated
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                Credits Allocated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {totalAllocated.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {doctorAllocations.length} doctors
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-500" />
                Credits Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {totalUsed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((totalUsed / totalAllocated) * 100)}% of allocated
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Overall Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getEfficiencyColor(overallEfficiency)}`}>
                {overallEfficiency}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Organization average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="doctors" className="gap-2">
              <UserCog className="h-4 w-4" />
              Doctor Analytics
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2">
              <Building2 className="h-4 w-4" />
              Department Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Doctor-wise Credit Usage
                </CardTitle>
                <CardDescription>
                  Individual doctor performance and credit allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Doctor</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Allocated</TableHead>
                        <TableHead>Used</TableHead>
                        <TableHead>Usage %</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctorAllocations.map((doctor) => {
                        const usagePercentage = Math.round((doctor.used / doctor.allocated) * 100);
                        return (
                          <TableRow key={doctor.id} className="hover:bg-muted/20">
                            <TableCell className="font-medium">{doctor.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{doctor.department}</Badge>
                            </TableCell>
                            <TableCell className="font-mono">
                              {doctor.allocated.toLocaleString()}
                            </TableCell>
                            <TableCell className="font-mono">
                              {doctor.used.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={usagePercentage} 
                                  className="w-16 h-2" 
                                />
                                <span className="text-sm font-medium min-w-[40px]">
                                  {usagePercentage}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${getEfficiencyColor(doctor.efficiency)}`}>
                                {doctor.efficiency}%
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(doctor.lastUsed, 'MMM dd, HH:mm')}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Settings className="h-3 w-3" />
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Department-wise Credit Usage
                </CardTitle>
                <CardDescription>
                  Department performance and budget allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Department</TableHead>
                        <TableHead>Doctors</TableHead>
                        <TableHead>Allocated</TableHead>
                        <TableHead>Used</TableHead>
                        <TableHead>Usage %</TableHead>
                        <TableHead>Avg/Doctor</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentAllocations.map((dept) => {
                        const usagePercentage = Math.round((dept.used / dept.allocated) * 100);
                        return (
                          <TableRow key={dept.id} className="hover:bg-muted/20">
                            <TableCell className="font-medium">{dept.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                {dept.doctorCount}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">
                              {dept.allocated.toLocaleString()}
                            </TableCell>
                            <TableCell className="font-mono">
                              {dept.used.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={usagePercentage} 
                                  className="w-16 h-2" 
                                />
                                <span className="text-sm font-medium min-w-[40px]">
                                  {usagePercentage}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {dept.avgUsagePerDoctor.toFixed(1)}
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${getEfficiencyColor(dept.efficiency)}`}>
                                {dept.efficiency}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Settings className="h-3 w-3" />
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}