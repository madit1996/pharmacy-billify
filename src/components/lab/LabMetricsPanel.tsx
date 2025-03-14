
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";
import { Activity, BeakerIcon, BarChart2, CheckCircle, Clock } from "lucide-react";
import { LabTest } from "@/types/lab-tests";

interface LabMetricsPanelProps {
  pendingTests: LabTest[];
  completedTests: LabTest[];
}

const LabMetricsPanel = ({ pendingTests, completedTests }: LabMetricsPanelProps) => {
  // Calculate total revenue from completed tests (simulated)
  const totalRevenue = completedTests.length * 50; // Assuming average test cost of $50
  
  // Calculate test frequency for the chart
  const testFrequency = getTestFrequency([...pendingTests, ...completedTests]);

  // Prepare data for test popularity chart
  const testChartData = Object.entries(testFrequency)
    .map(([testName, count]) => ({ testName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Get top 5 tests

  return (
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
      
      {/* Popular Tests Chart */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-4 h-[300px]">
        <CardContent className="pt-6 h-full">
          <p className="text-sm font-medium text-gray-500 mb-4">Most Popular Tests</p>
          
          <div className="h-[220px]">
            <ChartContainer
              config={{
                test1: { color: "#3b82f6" },
                test2: { color: "#8b5cf6" },
                test3: { color: "#06b6d4" },
                test4: { color: "#10b981" },
                test5: { color: "#f59e0b" },
              }}
            >
              <BarChart data={testChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="testName" />
                <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-test1)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
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

export default LabMetricsPanel;
