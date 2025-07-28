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
  FlaskConical,
  BedDouble,
  Calendar,
  Stethoscope,
  Activity as Pulse,
  DollarSign,
  Clock,
  AlertCircle,
  Heart
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Appointment status data
  const appointmentStatusData = [
    { name: "Completed", value: 156, color: "#10B981" },
    { name: "Upcoming", value: 89, color: "#3B82F6" },
    { name: "Missed", value: 23, color: "#EF4444" }
  ];
  
  // Revenue data for different departments including ICU
  const departmentRevenueData = [
    { name: "ICU", value: 98000 },
    { name: "IPD", value: 72000 },
    { name: "OPD", value: 45000 },
    { name: "Pharmacy", value: 38000 },
    { name: "Lab", value: 25000 },
    { name: "OT", value: 35000 }
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
  
  // Department metrics including ICU
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
      title: "ICU",
      value: "24",
      revenue: "$98,000",
      percentage: "+22.1%",
      trend: "up",
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      title: "OT",
      value: "47",
      revenue: "$35,000",
      percentage: "+18.7%",
      trend: "up",
      icon: <Activity className="h-5 w-5 text-orange-500" />
    }
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Year-over-year revenue comparison data
  const revenueComparisonData = [
    { name: "Jan", thisYear: 42000, lastYear: 38000 },
    { name: "Feb", thisYear: 48000, lastYear: 42000 },
    { name: "Mar", thisYear: 55000, lastYear: 48000 },
    { name: "Apr", thisYear: 61000, lastYear: 52000 },
    { name: "May", thisYear: 58000, lastYear: 55000 },
    { name: "Jun", thisYear: 65000, lastYear: 58000 },
    { name: "Jul", thisYear: 70000, lastYear: 62000 },
    { name: "Aug", thisYear: 75000, lastYear: 68000 },
    { name: "Sep", thisYear: 80000, lastYear: 72000 },
    { name: "Oct", thisYear: 88000, lastYear: 78000 },
    { name: "Nov", thisYear: 92000, lastYear: 82000 },
    { name: "Dec", thisYear: 98000, lastYear: 88000 }
  ];

  // Today's appointments
  const todaysAppointments = [
    { time: "09:00", patient: "Ahmad Wijaya", doctor: "Dr. Sarah", type: "Consultation", status: "completed" },
    { time: "09:30", patient: "Siti Rahayu", doctor: "Dr. Budi", type: "Follow-up", status: "completed" },
    { time: "10:00", patient: "Dewi Sari", doctor: "Dr. Andi", type: "Check-up", status: "in-progress" },
    { time: "10:30", patient: "Budi Santoso", doctor: "Dr. Sarah", type: "Consultation", status: "upcoming" },
    { time: "11:00", patient: "Maya Indah", doctor: "Dr. Dewi", type: "Follow-up", status: "upcoming" }
  ];

  // Payment methods data
  const paymentMethodsData = [
    { name: "Cash", value: 45, amount: 125000 },
    { name: "UPI", value: 30, amount: 89000 },
    { name: "Online", value: 20, amount: 67000 },
    { name: "Insurance", value: 5, amount: 32000 }
  ];

  // Patient overview data
  const patientOverviewData = [
    { name: "New Patients", value: 156, percentage: 65 },
    { name: "Returning Patients", value: 84, percentage: 35 }
  ];

  // Doctor wise collection
  const doctorCollectionData = [
    { name: "Dr. Sarah Tanoto", amount: 45000, patients: 32, department: "Cardiology" },
    { name: "Dr. Budi Santoso", amount: 38000, patients: 28, department: "Orthopedics" },
    { name: "Dr. Andi Wijaya", amount: 42000, patients: 35, department: "Neurology" },
    { name: "Dr. Dewi Sutanto", amount: 35000, patients: 25, department: "Pediatrics" }
  ];

  // Today's follow-ups
  const todaysFollowUps = [
    { patient: "Ahmad Wijaya", doctor: "Dr. Sarah", time: "14:00", condition: "Post-surgery", status: "scheduled" },
    { patient: "Siti Rahayu", doctor: "Dr. Budi", time: "15:30", condition: "Diabetes check", status: "completed" },
    { patient: "Maya Indah", doctor: "Dr. Dewi", time: "16:00", condition: "Vaccination", status: "upcoming" }
  ];

  // Top serving areas
  const topServingAreas = [
    { area: "Jakarta Selatan", patients: 245, percentage: 32 },
    { area: "Jakarta Pusat", patients: 189, percentage: 25 },
    { area: "Jakarta Barat", patients: 156, percentage: 21 },
    { area: "Jakarta Utara", patients: 98, percentage: 13 },
    { area: "Jakarta Timur", patients: 67, percentage: 9 }
  ];

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hospital Dashboard</h1>
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
      
      {/* Financial Summary - Moved to Top */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Financial Summary
          </CardTitle>
          <CardDescription>Monthly financial overview and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-green-800">Total Revenue</h4>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">$313,000</p>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +18.5% from last month
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-800">Outstanding Payments</h4>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-700">$24,500</p>
              <p className="text-xs text-blue-600 mt-1">7.8% of total revenue</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-purple-800">Net Profit</h4>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-700">$187,200</p>
              <p className="text-xs text-purple-600 mt-1">59.8% profit margin</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-amber-800">Average Bill Value</h4>
                <FileText className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-700">$425.50</p>
              <p className="text-xs text-amber-600 mt-1">+$32 from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
      
      {/* Appointments Status and Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Status
            </CardTitle>
            <CardDescription>Today's appointment overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {appointmentStatusData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue by Department</CardTitle>
            <CardDescription>Monthly revenue distribution including ICU</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Comparison Chart - Current vs Last Year */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Revenue Comparison</CardTitle>
          <CardDescription>Current year vs last year monthly comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="thisYear" stroke="#8884d8" strokeWidth={3} name="2024" />
                <Line type="monotone" dataKey="lastYear" stroke="#82ca9d" strokeWidth={3} name="2023" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Today's Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Appointments
            </CardTitle>
            <CardDescription>Current day schedule overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {todaysAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-blue-600">{appointment.time}</div>
                    <div>
                      <p className="text-sm font-medium">{appointment.patient}</p>
                      <p className="text-xs text-gray-500">{appointment.doctor} • {appointment.type}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                    appointment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {appointment.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Today's Follow-ups
            </CardTitle>
            <CardDescription>Scheduled follow-up appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {todaysFollowUps.map((followUp, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-purple-600">{followUp.time}</div>
                    <div>
                      <p className="text-sm font-medium">{followUp.patient}</p>
                      <p className="text-xs text-gray-500">{followUp.doctor} • {followUp.condition}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    followUp.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {followUp.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods and Patient Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Payment Methods Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Payment Methods Analytics
            </CardTitle>
            <CardDescription>Revenue distribution by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, entry) => [`${value}%`, `$${entry.payload.amount.toLocaleString()}`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {paymentMethodsData.map((method, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                    <span className="text-sm">{method.name}</span>
                  </div>
                  <span className="font-medium">${method.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Patient Overview
            </CardTitle>
            <CardDescription>New vs returning patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patientOverviewData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percentage}) => `${name}: ${percentage}%`}
                  >
                    {patientOverviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#3B82F6'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {patientOverviewData.map((patient, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: index === 0 ? '#10B981' : '#3B82F6'}}></div>
                    <span className="text-sm">{patient.name}</span>
                  </div>
                  <span className="font-medium">{patient.value} ({patient.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor-wise Collection and Top Serving Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Doctor-wise Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-green-600" />
              Doctor-wise Collection
            </CardTitle>
            <CardDescription>Revenue generated by each doctor today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorCollectionData.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.department} • {doctor.patients} patients</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${doctor.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Serving Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Top Serving Areas
            </CardTitle>
            <CardDescription>Patient distribution by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServingAreas.map((area, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{area.area}</span>
                    <span className="text-sm text-gray-600">{area.patients} patients ({area.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{width: `${area.percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
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
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events from all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <Heart className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">ICU patient admitted - Critical condition</p>
                <p className="text-xs text-gray-500">5 minutes ago • ICU</p>
              </div>
            </div>
            
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
                <FlaskConical className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Lab results uploaded for Siti Rahayu</p>
                <p className="text-xs text-gray-500">32 minutes ago • Laboratory</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <Activity className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Surgery completed in OT-2</p>
                <p className="text-xs text-gray-500">45 minutes ago • OT</p>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
