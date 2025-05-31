
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  TrendingDown,
  Users, 
  Package, 
  AlertTriangle,
  Plus,
  FileText,
  Calendar,
  Star,
  Clock,
  Eye,
  ShoppingCart,
  Globe,
  Store,
  Percent
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreatePODialog from "@/components/material-store/CreatePODialog";
import CreateGRNDialog from "@/components/material-store/CreateGRNDialog";
import AuditInventoryDialog from "./AuditInventoryDialog";
import OnlineOrdersDialog from "./OnlineOrdersDialog";

const PharmacyAnalyticsTab = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Sample data for charts
  const salesData = {
    week: [
      { name: "Mon", online: 1400, offline: 1000, total: 2400 },
      { name: "Tue", online: 800, offline: 598, total: 1398 },
      { name: "Wed", online: 4500, offline: 5300, total: 9800 },
      { name: "Thu", online: 1800, offline: 2108, total: 3908 },
      { name: "Fri", online: 2200, offline: 2600, total: 4800 },
      { name: "Sat", online: 1800, offline: 2000, total: 3800 },
      { name: "Sun", online: 2000, offline: 2300, total: 4300 }
    ],
    month: Array.from({ length: 30 }, (_, i) => ({
      name: `${i + 1}`,
      online: Math.floor(Math.random() * 5000),
      offline: Math.floor(Math.random() * 5000),
      total: 0
    })).map(item => ({ ...item, total: item.online + item.offline })),
    year: Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      online: Math.floor(Math.random() * 25000),
      offline: Math.floor(Math.random() * 25000),
      total: 0
    })).map(item => ({ ...item, total: item.online + item.offline }))
  };
  
  // Repeat customer percentage data
  const repeatCustomerData = [
    { month: "Jan", percentage: 35, trend: "up" },
    { month: "Feb", percentage: 38, trend: "up" },
    { month: "Mar", percentage: 42, trend: "up" },
    { month: "Apr", percentage: 39, trend: "down" },
    { month: "May", percentage: 45, trend: "up" },
    { month: "Jun", percentage: 48, trend: "up" }
  ];

  // Online vs Offline distribution
  const orderChannelData = [
    { name: "Online Orders", value: 35, color: "#8B5CF6" },
    { name: "Walk-in Sales", value: 65, color: "#10B981" }
  ];

  // Customer acquisition data
  const customerAcquisitionData = [
    { month: "Jan", newCustomers: 45, returningCustomers: 120 },
    { month: "Feb", newCustomers: 52, returningCustomers: 135 },
    { month: "Mar", newCustomers: 48, returningCustomers: 142 },
    { month: "Apr", newCustomers: 38, returningCustomers: 148 },
    { month: "May", newCustomers: 42, returningCustomers: 156 },
    { month: "Jun", newCustomers: 50, returningCustomers: 165 }
  ];
  
  const inventoryData = {
    week: [
      { name: "Mon", stock: 120, demand: 140 },
      { name: "Tue", stock: 110, demand: 130 },
      { name: "Wed", stock: 140, demand: 120 },
      { name: "Thu", stock: 130, demand: 150 },
      { name: "Fri", stock: 150, demand: 140 },
      { name: "Sat", stock: 170, demand: 130 },
      { name: "Sun", stock: 160, demand: 120 }
    ],
    month: Array.from({ length: 30 }, (_, i) => ({
      name: `${i + 1}`,
      stock: Math.floor(Math.random() * 100) + 100,
      demand: Math.floor(Math.random() * 100) + 100
    })),
    year: Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      stock: Math.floor(Math.random() * 200) + 100,
      demand: Math.floor(Math.random() * 200) + 100
    }))
  };
  
  // Popular categories data
  const categoryData = [
    { name: "Antibiotics", value: 35 },
    { name: "Pain Relief", value: 25 },
    { name: "Vitamins", value: 20 },
    { name: "Cold & Flu", value: 15 },
    { name: "Diabetes", value: 5 }
  ];
  
  // Low stock items
  const lowStockItems = [
    { name: "Paracetamol 500mg", currentStock: 12, minStock: 50, urgency: "critical", lastSold: "2 hours ago" },
    { name: "Amoxicillin 250mg", currentStock: 25, minStock: 40, urgency: "warning", lastSold: "4 hours ago" },
    { name: "Insulin Pen", currentStock: 8, minStock: 15, urgency: "critical", lastSold: "1 hour ago" },
    { name: "Blood Pressure Monitor", currentStock: 3, minStock: 10, urgency: "critical", lastSold: "6 hours ago" },
    { name: "Vitamin D3", currentStock: 18, minStock: 30, urgency: "warning", lastSold: "3 hours ago" }
  ];

  // High demand items in region
  const regionalDemandItems = [
    { name: "Cough Syrup", demandIncrease: 45, region: "Local Area", trend: "seasonal" },
    { name: "Fever Reducer", demandIncrease: 38, region: "City", trend: "epidemic" },
    { name: "Antihistamine", demandIncrease: 32, region: "State", trend: "allergy-season" },
    { name: "Hand Sanitizer", demandIncrease: 28, region: "Local Area", trend: "consistent" },
    { name: "Vitamin C", demandIncrease: 25, region: "Region", trend: "health-conscious" }
  ];

  // Expiry alerts
  const expiryAlerts = [
    { name: "Aspirin 325mg", batch: "BT001", expiryDate: "2024-06-15", daysLeft: 15, quantity: 200 },
    { name: "Cough Drops", batch: "BT045", expiryDate: "2024-06-20", daysLeft: 20, quantity: 150 },
    { name: "Eye Drops", batch: "BT089", expiryDate: "2024-07-01", daysLeft: 31, quantity: 75 },
    { name: "Antacid Tablets", batch: "BT123", expiryDate: "2024-07-10", daysLeft: 40, quantity: 300 }
  ];

  // Sales patterns
  const peakHours = [
    { hour: "9-10 AM", sales: 45, customers: 28 },
    { hour: "12-1 PM", sales: 62, customers: 35 },
    { hour: "6-7 PM", sales: 78, customers: 42 },
    { hour: "8-9 PM", sales: 56, customers: 31 }
  ];

  // Current metrics
  const currentRepeatRate = 48; // percentage
  const previousRepeatRate = 45; // percentage
  const repeatRateChange = currentRepeatRate - previousRepeatRate;

  const onlineOrderPercentage = 35;
  const averageOrderValue = {
    online: 520,
    offline: 380
  };

  // Pharmacy metrics
  const metrics = [
    {
      title: "Daily Sales",
      value: "$2,850",
      percentage: "+4.5%",
      trend: "up",
      icon: <Activity className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Repeat Customer Rate",
      value: `${currentRepeatRate}%`,
      percentage: `${repeatRateChange > 0 ? '+' : ''}${repeatRateChange.toFixed(1)}%`,
      trend: repeatRateChange > 0 ? "up" : "down",
      icon: <Percent className="h-5 w-5 text-green-500" />
    },
    {
      title: "Online Orders",
      value: `${onlineOrderPercentage}%`,
      percentage: "+12.3%",
      trend: "up",
      icon: <Globe className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Avg Order Value",
      value: "$42.50",
      percentage: "+8.5%",
      trend: "up",
      icon: <ShoppingBag className="h-5 w-5 text-yellow-500" />
    }
  ];
  
  // Top selling products
  const topProducts = [
    { name: "Paracetamol 500mg", sales: 289, revenue: 1445 },
    { name: "Amoxicillin 250mg", sales: 235, revenue: 1175 },
    { name: "Vitamin C 1000mg", sales: 198, revenue: 990 },
    { name: "Aspirin 325mg", sales: 152, revenue: 760 },
    { name: "Ibuprofen 400mg", sales: 147, revenue: 735 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  {metric.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                )}
                <span className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.percentage} from last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              Sales Channel Distribution
            </CardTitle>
            <CardDescription>Online vs Offline order breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderChannelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      {orderChannelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Average Order Value</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple-500" />
                        Online
                      </span>
                      <span className="font-medium">₹{averageOrderValue.online}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-green-500" />
                        Walk-in
                      </span>
                      <span className="font-medium">₹{averageOrderValue.offline}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Repeat Customer Analytics
            </CardTitle>
            <CardDescription>Customer retention trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={repeatCustomerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Repeat Rate']} />
                  <Area 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Acquisition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Customer Acquisition Analysis
          </CardTitle>
          <CardDescription>New vs returning customer trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerAcquisitionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="newCustomers" fill="#8B5CF6" name="New Customers" />
                <Bar dataKey="returningCustomers" fill="#10B981" name="Returning Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Critical Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-lg">Low Stock Alert</CardTitle>
              </div>
              <div className="flex gap-2">
                <CreatePODialog />
                <CreateGRNDialog />
              </div>
            </div>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <Badge className={getUrgencyColor(item.urgency)}>
                        {item.urgency}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Stock: {item.currentStock}/{item.minStock} • Last sold: {item.lastSold}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3 mr-1" />
                    Restock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Demand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              High Regional Demand
            </CardTitle>
            <CardDescription>Items trending in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionalDemandItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <Badge variant="secondary">+{item.demandIncrease}%</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.region} • {item.trend}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiry Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            Expiry Management
          </CardTitle>
          <CardDescription>Items approaching expiry dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Batch No.</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiryAlerts.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.batch}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>
                    <Badge className={item.daysLeft <= 20 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {item.daysLeft} days
                    </Badge>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      {item.daysLeft <= 20 ? 'Return' : 'Monitor'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sales Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Peak Sales Hours
            </CardTitle>
            <CardDescription>Optimize staffing based on peak times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {peakHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{hour.hour}</h4>
                    <p className="text-sm text-gray-500">{hour.customers} customers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{hour.sales}</p>
                    <p className="text-xs text-gray-500">avg. sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common pharmacy operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <CreatePODialog />
              <CreateGRNDialog />
              <OnlineOrdersDialog />
              <AuditInventoryDialog />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Charts */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monitor online vs offline sales performance</CardDescription>
            </div>
            <Tabs defaultValue="week" value={dateRange} onValueChange={(value) => setDateRange(value as 'week' | 'month' | 'year')}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData[dateRange]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="offline" fill="#10B981" name="Walk-in Sales" />
                <Bar dataKey="online" fill="#8B5CF6" name="Online Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Inventory and Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Stock levels vs demand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryData[dateRange]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stock" stroke="#8B5CF6" />
                  <Line type="monotone" dataKey="demand" stroke="#D946EF" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name}) => name}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-4">
                    {categoryData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="h-3 w-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm flex-1">{item.name}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Best performing products by sales volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {topProducts.map((product, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center mb-3 border">
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                    <h3 className="font-medium text-sm mb-2">{product.name}</h3>
                    <div className="text-xs text-gray-500 mb-1">{product.sales} units</div>
                    <div className="font-medium">${product.revenue}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyAnalyticsTab;
