
import { RepresentativeAnalytics as RepAnalyticsType } from "@/contexts/lab/LabContextTypes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { User, Star } from "lucide-react";

interface RepresentativeAnalyticsProps {
  analytics: RepAnalyticsType[];
}

const RepresentativeAnalytics = ({ analytics }: RepresentativeAnalyticsProps) => {
  if (!analytics || analytics.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No representative data available
      </div>
    );
  }

  // Prepare data for chart
  const chartData = analytics.map(rep => ({
    name: rep.representativeName.split(' ')[0], // First name only for chart
    tests: rep.testsHandled,
    steps: rep.stepsCompleted,
    efficiency: rep.efficiency,
    fullName: rep.representativeName
  }));

  // Colors for the chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name === 'tests' ? 'Tests Handled' : 'Steps Completed']}
              labelFormatter={(label) => {
                const rep = chartData.find(item => item.name === label);
                return rep ? rep.fullName : label;
              }}
            />
            <Bar dataKey="tests" fill="#8884d8" name="Tests Handled">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            <Bar dataKey="steps" fill="#82ca9d" name="Steps Completed">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {analytics.map((rep, index) => (
          <div key={rep.representativeId} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">{rep.representativeName}</h4>
                  <p className="text-sm text-gray-500">{rep.testsHandled} tests • {rep.stepsCompleted} steps</p>
                </div>
              </div>
              
              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">{rep.efficiency.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <h5 className="text-xs font-medium mb-1 text-gray-500">SPECIALTIES</h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(rep.specialties).map(([specialty, count]) => (
                  <span 
                    key={specialty} 
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {specialty} ({count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepresentativeAnalytics;
