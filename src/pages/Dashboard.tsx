
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  Activity, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  User,
  FileText,
  Flask,
  BedDouble,
  Calendar,
  Stethoscope,
  Activity as Pulse,
  DollarSign
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Revenue data for different departments
  const departmentRevenueData = [
    { name: "OPD", value: 45000 },
    { name: "IPD", value: 72000 },
    { name: "Pharmacy", value: 38000 },
    { name: "Lab", value: 25000 },
    { name: "Radiology", value: 18000 }
  ];
  
  // Monthly revenue trend data
  const monthlyRevenueData = [
    { name: "Jan", revenue: 42000 },
    { name: "Feb", revenue: 48000 },
    { name: "Mar", revenue: 55000 },
    { name: "Apr", revenue: 61000 },
    { name: "May", revenue: 58000 },
    { name: "Jun", revenue: 65000 },
    { name: "Jul", revenue: 70000 },
    { name: "Aug", revenue: 75000 },
    { name: "Sep", revenue: 80000 },
    { name: "Oct", revenue: 88000 },
    { name: "Nov", revenue: 92000 },
    { name: "Dec", revenue: 98000 }
  ];
  
  // Top diseases data
  const topDiseasesData = [
    { name: "Hypertension", count: 145 },
    { name: "Diabetes", count: 132 },
    { name: "Respiratory Infections", count: 98 },
    { name: "Arthritis", count: 87 },
    { name: "Allergies", count: 76 }
  ];
  
  // Top doctors data
  const topDoctorsData = [
    { name: "Dr. Andi Wijaya", department: "Cardiology", patients: 128, revenue: 32000 },
    { name: "Dr. Dewi Sutanto", department: "Pediatrics", patients: 115, revenue: 28750 },
    { name: "Dr. Budi Santoso", department: "Orthopedics", patients: 96, revenue: 24000 },
    { name: "Dr. Sarah Tanoto", department: "Neurology", patients: 85, revenue: 21250 }
  ];
  
  // Department metrics
  const departmentMetrics = [
    {
      title: "OPD",
      value: "328",
      revenue: "$45,000",
      percentage: "+15.3%",
      trend: "up",
      icon: <User className="h-5 w-5 text-blue-500" />
    },
    {
      title: "IPD",
      value: "84",
      revenue: "$72,000",
      percentage: "+8.2%",
      trend: "up",
      icon: <BedDouble className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Pharmacy",
      value: "1,423",
      revenue: "$38,000",
      percentage: "+12.5%",
      trend: "up",
      icon: <ShoppingBag className="h-5 w-5 text-green-500" />
    },
    {
      title: "Laboratory",
      value: "235",
      revenue: "$25,000",
      percentage: "+9.8%",
      trend: "up",
      icon: <Flask className="h-5 w-5 text-amber-500" />
    }
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="container mx-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
        <div className="flex gap-3">
          <Button 
            className="bg-pharmacy-primary hover:bg-pharmacy-primary/90"
            onClick={() => navigate('/pharmacy')}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Pharmacy
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/patients')}
          >
            <Users className="h-4 w-4 mr-2" />
            Patients
          </Button>
        </div>
      </div>
      
      {/* Department Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {departmentMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                    <span className="text-sm text-gray-500 ml-2">visits</span>
                  </div>
                  <p className="text-sm font-medium mt-1">{metric.revenue}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  {metric.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-xs font-medium text-green-500">
                  {metric.percentage} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Department</CardTitle>
            <CardDescription>Distribution across units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentRevenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Doctors and Diseases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Doctors</CardTitle>
            <CardDescription>By patient count and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topDoctorsData.map((doctor, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{doctor.name}</p>
                    <p className="text-xs text-gray-500">{doctor.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{doctor.patients} patients</p>
                    <p className="text-xs text-gray-500">${doctor.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Diseases on the Rise</CardTitle>
            <CardDescription>Most common diagnoses this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topDiseasesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events from all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New prescription filled for Ahmad Wijaya</p>
                  <p className="text-xs text-gray-500">15 minutes ago • Pharmacy</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Flask className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Lab results uploaded for Siti Rahayu</p>
                  <p className="text-xs text-gray-500">32 minutes ago • Laboratory</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New appointment scheduled with Dr. Budi</p>
                  <p className="text-xs text-gray-500">1 hour ago • OPD</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <BedDouble className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New patient admitted to Ward 3</p>
                  <p className="text-xs text-gray-500">2 hours ago • IPD</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <Pulse className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Emergency case handled for Rini Kusuma</p>
                  <p className="text-xs text-gray-500">3 hours ago • Emergency</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Monthly overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-green-800">Total Revenue</h4>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-700">$198,000</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12.3% from last month
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Outstanding Payments</span>
                  <span className="font-medium">$24,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Bill Value</span>
                  <span className="font-medium">$345.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expenses</span>
                  <span className="font-medium">$87,300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Profit</span>
                  <span className="font-medium text-green-600">$110,700</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
