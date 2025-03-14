
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Activity, BeakerIcon, BarChart2, CheckCircle, Clock, Calendar } from "lucide-react";
import { LabTest } from "@/types/lab-tests";
import { useState } from "react";

interface LabMetricsPanelProps {
  pendingTests: LabTest[];
  completedTests: LabTest[];
}

const LabMetricsPanel = ({ pendingTests, completedTests }: LabMetricsPanelProps) => {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');
  
  // Calculate total revenue from completed tests
  const totalRevenue = completedTests.reduce((sum, test) => {
    return sum + (test.price || 50); // Use test price if available, otherwise default to 50
  }, 0);
  
  // Calculate test frequency for the chart
  const testFrequency = getTestFrequency([...pendingTests, ...completedTests]);

  // Prepare data for test popularity chart
  const testChartData = Object.entries(testFrequency)
    .map(([testName, count]) => ({ testName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Get top 5 tests

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Generate time-based data based on selected time frame
  const timeData = generateTimeData(completedTests, timeFrame);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <BarChart2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Tests */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Tests</p>
                <h3 className="text-2xl font-bold mt-1">{pendingTests.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Completed Tests */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Tests</p>
                <h3 className="text-2xl font-bold mt-1">{completedTests.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <h3 className="text-2xl font-bold mt-1">
                  {calculateCompletionRate(pendingTests.length, completedTests.length)}%
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time-based chart */}
        <Card className="h-[400px]">
          <CardContent className="pt-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-medium">Test Trends</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeFrame('week')} 
                  className={`px-3 py-1 text-xs rounded-full ${timeFrame === 'week' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setTimeFrame('month')} 
                  className={`px-3 py-1 text-xs rounded-full ${timeFrame === 'month' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setTimeFrame('year')} 
                  className={`px-3 py-1 text-xs rounded-full ${timeFrame === 'year' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                >
                  Year
                </button>
              </div>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pathology" stroke="#8884d8" />
                  <Line type="monotone" dataKey="radiology" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Test Popularity Chart */}
        <Card className="h-[400px]">
          <CardContent className="pt-6 h-full">
            <p className="text-base font-medium mb-4">Most Popular Tests</p>
            
            <div className="flex h-[300px]">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={testChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="count"
                      label={({testName}) => testName.split(' ')[0]}
                    >
                      {testChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} tests`, props.payload.testName]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-1/2">
                <ul className="space-y-2">
                  {testChartData.map((item, index) => (
                    <li key={item.testName} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm truncate">{item.testName}</span>
                      <span className="ml-auto text-sm font-medium">{item.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to calculate test frequency
function getTestFrequency(tests: LabTest[]): Record<string, number> {
  const frequency: Record<string, number> = {};
  
  tests.forEach(test => {
    if (frequency[test.testName]) {
      frequency[test.testName] += 1;
    } else {
      frequency[test.testName] = 1;
    }
  });
  
  return frequency;
}

// Calculate completion rate
function calculateCompletionRate(pending: number, completed: number): number {
  const total = pending + completed;
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Generate time series data based on selected timeframe
function generateTimeData(tests: LabTest[], timeFrame: 'week' | 'month' | 'year') {
  const now = new Date();
  let data: { name: string; pathology: number; radiology: number }[] = [];

  if (timeFrame === 'week') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      data.push({
        name: dayName,
        pathology: countTestsByDateAndType(tests, date, 'pathology'),
        radiology: countTestsByDateAndType(tests, date, 'radiology')
      });
    }
  } else if (timeFrame === 'month') {
    // Last 4 weeks
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      
      data.unshift({
        name: `Week ${4-i}`,
        pathology: countTestsByWeekAndType(tests, weekStart, weekEnd, 'pathology'),
        radiology: countTestsByWeekAndType(tests, weekStart, weekEnd, 'radiology')
      });
    }
  } else if (timeFrame === 'year') {
    // Last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = now.getMonth();
    
    for (let i = 11; i >= 0; i--) {
      const month = (currentMonth - i + 12) % 12;
      data.push({
        name: months[month],
        pathology: Math.floor(Math.random() * 10) + 1, // Simulated data
        radiology: Math.floor(Math.random() * 8) + 1   // Simulated data
      });
    }
  }

  return data;
}

// Count tests by date and type (pathology/radiology)
function countTestsByDateAndType(tests: LabTest[], date: Date, category: 'pathology' | 'radiology') {
  return tests.filter(test => {
    const testDate = test.completedDate || test.orderedDate;
    return (
      testDate.getDate() === date.getDate() &&
      testDate.getMonth() === date.getMonth() &&
      testDate.getFullYear() === date.getFullYear() &&
      test.category === category
    );
  }).length;
}

// Count tests by week range and type
function countTestsByWeekAndType(
  tests: LabTest[], 
  startDate: Date, 
  endDate: Date, 
  category: 'pathology' | 'radiology'
) {
  return tests.filter(test => {
    const testDate = test.completedDate || test.orderedDate;
    return (
      testDate >= startDate &&
      testDate <= endDate &&
      test.category === category
    );
  }).length;
}

export default LabMetricsPanel;
