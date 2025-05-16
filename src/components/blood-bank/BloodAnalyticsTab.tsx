
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Separator } from "@/components/ui/separator";
import { Droplet } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const BloodAnalyticsTab = () => {
  const { 
    inventory, 
    bloodUnits, 
    donors, 
    requests,
    getDonorAnalytics,
    getRequestAnalytics,
    getCampPerformance
  } = useBloodBankContext();

  // Analytics calculations
  const donorsByBloodGroup = getDonorAnalytics();
  const requestsByStatus = getRequestAnalytics();
  const campPerformance = getCampPerformance();

  // Calculate total units by blood group
  const bloodUnitsByGroup = inventory.map(item => ({
    name: item.bloodGroup,
    available: item.available,
    reserved: item.reserved
  }));

  // Calculate expiry analysis
  const now = new Date();
  const thirtyDaysLater = new Date(now);
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  
  const expiryAnalysis = bloodUnits
    .filter(unit => unit.status === 'available')
    .reduce((acc: any, unit) => {
      const expiryDate = new Date(unit.expiryDate);
      
      if (expiryDate <= now) {
        acc.expired += 1;
      } else if (expiryDate <= thirtyDaysLater) {
        acc.expiringSoon += 1;
      } else {
        acc.valid += 1;
      }
      
      return acc;
    }, { valid: 0, expiringSoon: 0, expired: 0 });

  const expiryData = [
    { name: 'Valid', value: expiryAnalysis.valid },
    { name: 'Expiring Soon', value: expiryAnalysis.expiringSoon },
    { name: 'Expired', value: expiryAnalysis.expired }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Blood Bank Analytics</h2>
        
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{bloodUnits.length}</CardTitle>
              <CardDescription>Total Blood Units</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{bloodUnits.filter(u => u.status === 'available').length}</CardTitle>
              <CardDescription>Available Units</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{donors.length}</CardTitle>
              <CardDescription>Registered Donors</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</CardTitle>
              <CardDescription>Pending Requests</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Blood Inventory Status</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Blood Units by Group</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bloodUnitsByGroup}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, name === 'available' ? 'Available Units' : 'Reserved Units']} />
                    <Legend />
                    <Bar dataKey="available" name="Available" stackId="a" fill="#0088FE" />
                    <Bar dataKey="reserved" name="Reserved" stackId="a" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Units Expiry Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expiryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expiryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          index === 0 ? '#0088FE' :  // Valid - blue
                          index === 1 ? '#FFBB28' :  // Expiring Soon - yellow
                          '#FF8042'                  // Expired - orange
                        } />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Units']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Donor & Request Analytics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Donors by Blood Group</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={donorsByBloodGroup}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bloodGroup" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Donors']} />
                    <Legend />
                    <Bar dataKey="count" name="Number of Donors" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Request Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={requestsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                    >
                      {requestsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: any) => {
                        // Check if name is a string before using string methods
                        const displayName = typeof name === 'string' 
                          ? `${name.charAt(0).toUpperCase()}${name.slice(1)} Requests` 
                          : `${name} Requests`;
                        return [value, displayName];
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {campPerformance.length > 0 && (
        <>
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Camp Performance</h3>
            <Card>
              <CardHeader>
                <CardTitle>Donation Camp Performance</CardTitle>
                <CardDescription>Expected vs. Actual Donors</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={campPerformance}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="campName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="expected" name="Expected Donors" fill="#8884d8" />
                      <Bar dataKey="donors" name="Actual Donors" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BloodGroupCard inventory={inventory.find(i => i.bloodGroup === 'A+')?.available || 0} group="A+" />
        <BloodGroupCard inventory={inventory.find(i => i.bloodGroup === 'B+')?.available || 0} group="B+" />
        <BloodGroupCard inventory={inventory.find(i => i.bloodGroup === 'O+')?.available || 0} group="O+" />
        <BloodGroupCard inventory={inventory.find(i => i.bloodGroup === 'AB+')?.available || 0} group="AB+" />
        <BloodGroupCard inventory={inventory.find(i => i.bloodGroup === 'A-')?.available || 0} group="A-" />
        <BloodGroupCard inventory={inventory.find(i => i.bloodGroup === 'B-')?.available || 0} group="B-" />
        <BloodGroupCard inventory={inventory.find(i => i.bloodGroup === 'O-')?.available || 0} group="O-" />
        <BloodGroupCard inventory={inventory.find(i => i.bloodGroup === 'AB-')?.available || 0} group="AB-" />
      </div>
    </div>
  );
};

interface BloodGroupCardProps {
  group: string;
  inventory: number;
}

const BloodGroupCard = ({ group, inventory }: BloodGroupCardProps) => {
  // Determine status color
  let statusColor = "text-green-600";
  let bgColor = "bg-green-50";
  if (inventory < 3) {
    statusColor = "text-red-600";
    bgColor = "bg-red-50";
  } else if (inventory < 10) {
    statusColor = "text-amber-600";
    bgColor = "bg-amber-50";
  }

  return (
    <div className={`flex items-center p-4 rounded-lg border ${bgColor}`}>
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mr-4">
        <Droplet className="h-6 w-6 text-red-600" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{group}</p>
        <p className={`text-sm font-medium ${statusColor}`}>
          {inventory} {inventory === 1 ? 'unit' : 'units'} available
        </p>
      </div>
    </div>
  );
};

export default BloodAnalyticsTab;
