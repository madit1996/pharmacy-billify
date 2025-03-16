
import { useState } from "react";
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
  Cell
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Activity, ShoppingBag, TrendingUp, Users, Package } from "lucide-react";

const PharmacyAnalyticsTab = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Sample data for charts
  const salesData = {
    week: [
      { name: "Mon", sales: 2400 },
      { name: "Tue", sales: 1398 },
      { name: "Wed", sales: 9800 },
      { name: "Thu", sales: 3908 },
      { name: "Fri", sales: 4800 },
      { name: "Sat", sales: 3800 },
      { name: "Sun", sales: 4300 }
    ],
    month: Array.from({ length: 30 }, (_, i) => ({
      name: `${i + 1}`,
      sales: Math.floor(Math.random() * 10000)
    })),
    year: Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      sales: Math.floor(Math.random() * 50000)
    }))
  };
  
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
      title: "Total Customers",
      value: "528",
      percentage: "+12.3%",
      trend: "up",
      icon: <Users className="h-5 w-5 text-green-500" />
    },
    {
      title: "Inventory Items",
      value: "1,423",
      percentage: "-2.1%",
      trend: "down",
      icon: <Package className="h-5 w-5 text-yellow-500" />
    },
    {
      title: "Average Order Value",
      value: "$42.50",
      percentage: "+8.5%",
      trend: "up",
      icon: <ShoppingBag className="h-5 w-5 text-purple-500" />
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
                <TrendingUp className={`h-4 w-4 mr-1 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.percentage} from last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Sales Charts */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monitor daily, monthly, and yearly sales performance</CardDescription>
            </div>
            <div>
              <TabsList>
                <TabsTrigger 
                  value="week" 
                  onClick={() => setDateRange('week')}
                  className={dateRange === 'week' ? 'bg-primary text-primary-foreground' : ''}
                >
                  Week
                </TabsTrigger>
                <TabsTrigger 
                  value="month" 
                  onClick={() => setDateRange('month')}
                  className={dateRange === 'month' ? 'bg-primary text-primary-foreground' : ''}
                >
                  Month
                </TabsTrigger>
                <TabsTrigger 
                  value="year" 
                  onClick={() => setDateRange('year')}
                  className={dateRange === 'year' ? 'bg-primary text-primary-foreground' : ''}
                >
                  Year
                </TabsTrigger>
              </TabsList>
            </div>
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
                <Bar dataKey="sales" fill="#8B5CF6" />
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
