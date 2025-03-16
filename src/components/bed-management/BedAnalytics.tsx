
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
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

type WardType = {
  id: number;
  name: string;
  type: string;
  totalBeds: number;
  availableBeds: number;
  beds: any[];
};

type BedAnalyticsProps = {
  wards: WardType[];
  occupancyData: any[];
  bedTurnoverData: any[];
  averageStayData: any[];
};

const BedAnalytics = ({ wards, occupancyData, bedTurnoverData, averageStayData }: BedAnalyticsProps) => {
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Bed Occupancy Rate</CardTitle>
            <CardDescription>Current occupancy by ward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="occupied"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bed Turnover Rate</CardTitle>
            <CardDescription>Average patients per bed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bedTurnoverData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="turnover" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Length of Stay</CardTitle>
            <CardDescription>Average days per admission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={averageStayData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="days" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bed Utilization Summary</CardTitle>
          <CardDescription>Key metrics across all wards</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward</TableHead>
                <TableHead>Total Beds</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Occupied</TableHead>
                <TableHead>Occupancy Rate</TableHead>
                <TableHead>Avg. Length of Stay</TableHead>
                <TableHead>Turnover Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wards.map((ward, index) => (
                <TableRow key={ward.id}>
                  <TableCell className="font-medium">{ward.name}</TableCell>
                  <TableCell>{ward.totalBeds}</TableCell>
                  <TableCell>{ward.availableBeds}</TableCell>
                  <TableCell>{ward.totalBeds - ward.availableBeds}</TableCell>
                  <TableCell>
                    {Math.round(((ward.totalBeds - ward.availableBeds) / ward.totalBeds) * 100)}%
                  </TableCell>
                  <TableCell>{averageStayData[index]?.days.toFixed(1)} days</TableCell>
                  <TableCell>{bedTurnoverData[index]?.turnover.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default BedAnalytics;
