
import { AcquisitionAnalytics as AcquisitionAnalyticsType } from "@/contexts/lab/LabContextTypes";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Home, Users, GanttChart, GitMerge } from "lucide-react";

interface AcquisitionAnalyticsProps {
  analytics: AcquisitionAnalyticsType;
}

const AcquisitionAnalytics = ({ analytics }: AcquisitionAnalyticsProps) => {
  // Prepare data for chart
  const chartData = [
    { name: 'Walk-ins', value: analytics.walkIn, icon: Users },
    { name: 'Home Collection', value: analytics.homeCollection, icon: Home },
    { name: 'Online', value: analytics.online, icon: GanttChart },
    { name: 'Referrals', value: analytics.referral, icon: GitMerge }
  ].filter(item => item.value > 0);

  const total = Object.values(analytics).reduce((sum, value) => sum + value, 0);

  // Colors for the chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // If no data available
  if (total === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No acquisition data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} tests (${((Number(value) / total) * 100).toFixed(1)}%)`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center mb-2">
                <div style={{ backgroundColor: `${COLORS[index % COLORS.length]}20`, color: COLORS[index % COLORS.length] }} className="p-2 rounded-full mr-2">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-sm">{item.name}</h4>
              </div>
              <div className="flex justify-between items-baseline">
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-sm text-gray-500">{((item.value / total) * 100).toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Insights</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          {analytics.homeCollection > analytics.walkIn && (
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Home collections are more popular than walk-ins, consider expanding this service.
            </li>
          )}
          {analytics.online > 0 && (
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              {analytics.online > (total * 0.3) 
                ? "Online bookings are significant - your digital presence is working well."
                : "Consider improving your online booking experience to increase digital engagement."}
            </li>
          )}
          {analytics.referral > 0 && (
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              {analytics.referral > (total * 0.2)
                ? "Referrals are a strong channel - your partner network is effective."
                : "Consider strengthening relationships with referring doctors and clinics."}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AcquisitionAnalytics;
