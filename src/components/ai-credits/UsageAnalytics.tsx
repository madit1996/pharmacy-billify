import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Brain, Stethoscope, Calendar } from 'lucide-react';

export function UsageAnalytics() {
  const { usage, balance } = useAiCredits();

  // Mock analytics data
  const dailyUsage = [
    { date: '2024-01-01', credits: 45, consultations: 3 },
    { date: '2024-01-02', credits: 60, consultations: 4 },
    { date: '2024-01-03', credits: 30, consultations: 2 },
    { date: '2024-01-04', credits: 75, consultations: 5 },
    { date: '2024-01-05', credits: 40, consultations: 3 },
    { date: '2024-01-06', credits: 55, consultations: 4 },
    { date: '2024-01-07', credits: 35, consultations: 2 }
  ];

  const featureUsage = [
    { name: 'AI Diagnosis', value: 180, color: 'hsl(var(--primary))' },
    { name: 'Treatment Recommendations', value: 120, color: 'hsl(var(--secondary))' },
    { name: 'Drug Interactions', value: 80, color: 'hsl(var(--accent))' },
    { name: 'Lab Result Analysis', value: 60, color: 'hsl(var(--muted))' }
  ];

  const totalCreditsUsed = featureUsage.reduce((sum, item) => sum + item.value, 0);
  const averageDailyUsage = dailyUsage.reduce((sum, day) => sum + day.credits, 0) / dailyUsage.length;

  const chartConfig = {
    credits: {
      label: "Credits",
      color: "hsl(var(--primary))",
    },
    consultations: {
      label: "Consultations",
      color: "hsl(var(--secondary))",
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Summary Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Used This Month</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCreditsUsed}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(averageDailyUsage)}</div>
          <p className="text-xs text-muted-foreground">Credits per day</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Used Feature</CardTitle>
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">AI Diagnosis</div>
          <p className="text-xs text-muted-foreground">40% of total usage</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87%</div>
          <p className="text-xs text-muted-foreground">Above average</p>
        </CardContent>
      </Card>

      {/* Daily Usage Chart */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Daily Usage Trend</CardTitle>
          <CardDescription>Credits used and consultations completed over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="credits" 
                  stroke="var(--color-credits)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-credits)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Feature Usage Distribution */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Usage by Feature</CardTitle>
          <CardDescription>Distribution of credits across different AI features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {featureUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.value} credits ({((data.value as number / totalCreditsUsed) * 100).toFixed(1)}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}