import { useState } from "react";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { BloodGroup, BloodUnit } from "@/types/blood-bank";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Droplet, Filter, Archive, ArchiveX, TransferIcon, MoveRight } from "lucide-react";
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import TransferDialog from "./TransferDialog";
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
const CRITICAL_LEVEL = 3;
const LOW_LEVEL = 10;

const stockAgeLabels = ['0-7 days', '8-14 days', '15-21 days', '22-28 days', '29-35 days', 'Over 35 days'];

const BloodStockManagementTab = () => {
  const { bloodUnits, inventory, updateBloodUnit, transfers } = useBloodBankContext();
  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'all'>('all');
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferFromLocation, setTransferFromLocation] = useState<string>("");

  // Get unique locations from blood units
  const locations = [...new Set(bloodUnits.map(unit => unit.location))];

  // Calculate critical stock levels
  const criticalStock = inventory.filter(item => item.available <= CRITICAL_LEVEL);
  const lowStock = inventory.filter(item => item.available > CRITICAL_LEVEL && item.available <= LOW_LEVEL);

  // Calculate stock age distribution
  const calculateStockAge = () => {
    const now = new Date();
    const ageDistribution = bloodUnits
      .filter(unit => unit.status === 'available')
      .reduce((acc: Record<string, number>, unit) => {
        const donationDate = new Date(unit.donationDate);
        const ageInDays = Math.floor((now.getTime() - donationDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (ageInDays <= 7) acc['0-7 days'] = (acc['0-7 days'] || 0) + 1;
        else if (ageInDays <= 14) acc['8-14 days'] = (acc['8-14 days'] || 0) + 1;
        else if (ageInDays <= 21) acc['15-21 days'] = (acc['15-21 days'] || 0) + 1;
        else if (ageInDays <= 28) acc['22-28 days'] = (acc['22-28 days'] || 0) + 1;
        else if (ageInDays <= 35) acc['29-35 days'] = (acc['29-35 days'] || 0) + 1;
        else acc['Over 35 days'] = (acc['Over 35 days'] || 0) + 1;
        
        return acc;
      }, {});
    
    return stockAgeLabels.map(label => ({
      age: label,
      units: ageDistribution[label] || 0
    }));
  };
  
  const stockAgeData = calculateStockAge();
  
  // Calculate stock consumption trend (mocked data for now)
  const stockTrendData = [
    { date: '2025-04-16', units: 45 },
    { date: '2025-04-23', units: 42 },
    { date: '2025-04-30', units: 48 },
    { date: '2025-05-07', units: 40 },
    { date: '2025-05-14', units: 35 }
  ];

  // Filter blood units based on selected filters
  const filteredUnits = bloodUnits.filter(unit => {
    if (filterGroup !== 'all' && unit.bloodGroup !== filterGroup) return false;
    if (filterLocation !== "all" && unit.location !== filterLocation) return false;
    return true;
  });

  // Handle status change for a blood unit
  const handleStatusChange = (unit: BloodUnit, newStatus: 'available' | 'reserved' | 'used' | 'expired') => {
    updateBloodUnit({
      ...unit,
      status: newStatus
    });
    
    toast.success(`Blood unit ${unit.id} status updated to ${newStatus}`);
  };

  // Get blood units that are expiring soon (within 7 days)
  const getExpiringSoon = () => {
    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    
    return bloodUnits.filter(unit => {
      if (unit.status !== 'available') return false;
      const expiryDate = new Date(unit.expiryDate);
      return expiryDate > now && expiryDate <= sevenDaysLater;
    });
  };
  
  const expiringSoon = getExpiringSoon();

  const openTransferDialog = (location?: string) => {
    setTransferFromLocation(location || "");
    setIsTransferDialogOpen(true);
  };

  // Get recent transfers (last 5)
  const recentTransfers = [...transfers]
    .sort((a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Blood Stock Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select value={filterGroup} onValueChange={(value: any) => setFilterGroup(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Storage Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterGroup('all');
                setFilterLocation('all');
              }}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Stock Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Inventory</TabsTrigger>
          <TabsTrigger value="expiry">Expiry & Transfer Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criticalStock.map(item => (
              <Card key={item.bloodGroup} className="border-red-500 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-red-600" />
                    <span>{item.bloodGroup}</span>
                    <Badge variant="destructive" className="ml-auto">CRITICAL</Badge>
                  </CardTitle>
                  <CardDescription>Critical Stock Level</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">{item.available} units available</p>
                  <p className="text-sm text-gray-500">{item.reserved} units reserved</p>
                </CardContent>
              </Card>
            ))}
            
            {lowStock.map(item => (
              <Card key={item.bloodGroup} className="border-amber-500 bg-amber-50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-amber-600" />
                    <span>{item.bloodGroup}</span>
                    <Badge className="bg-amber-500 ml-auto">LOW</Badge>
                  </CardTitle>
                  <CardDescription>Low Stock Level</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-amber-600">{item.available} units available</p>
                  <p className="text-sm text-gray-500">{item.reserved} units reserved</p>
                </CardContent>
              </Card>
            ))}
            
            {inventory
              .filter(item => item.available > LOW_LEVEL)
              .map(item => (
                <Card key={item.bloodGroup}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-green-600" />
                      <span>{item.bloodGroup}</span>
                      <Badge className="bg-green-500 ml-auto">HEALTHY</Badge>
                    </CardTitle>
                    <CardDescription>Healthy Stock Level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">{item.available} units available</p>
                    <p className="text-sm text-gray-500">{item.reserved} units reserved</p>
                  </CardContent>
                </Card>
              ))}
          </div>
          
          {/* Stock distribution charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Blood Stock Age Distribution</CardTitle>
                <CardDescription>Age of available blood units</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockAgeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                    <Legend />
                    <Bar dataKey="units" fill="#8884d8" name="Blood Units" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stock Consumption Trend</CardTitle>
                <CardDescription>Weekly consumption analysis</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} units`, 'Consumption']} />
                    <Legend />
                    <Line type="monotone" dataKey="units" stroke="#8884d8" name="Units Used" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Donation Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No blood units found matching the selected filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => {
                  // Calculate days until expiry
                  const expiryDate = new Date(unit.expiryDate);
                  const now = new Date();
                  const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <TableRow key={unit.id}>
                      <TableCell className="font-mono text-sm">{unit.id}</TableCell>
                      <TableCell>
                        <span className="bg-red-100 text-red-800 rounded-full px-3 py-1">
                          {unit.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell>{unit.volume} ml</TableCell>
                      <TableCell>{unit.donationDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{unit.expiryDate}</span>
                          {daysToExpiry <= 7 && daysToExpiry > 0 && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
                              {daysToExpiry}d left
                            </Badge>
                          )}
                          {daysToExpiry <= 0 && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{unit.location}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium
                            ${unit.status === 'available' ? 'bg-green-100 text-green-800' : 
                              unit.status === 'reserved' ? 'bg-blue-100 text-blue-800' : 
                              unit.status === 'used' ? 'bg-gray-100 text-gray-800' : 
                              'bg-red-100 text-red-800'}`}
                        >
                          {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {unit.status === 'available' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                onClick={() => handleStatusChange(unit, 'reserved')}
                              >
                                Reserve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-gray-600 border-gray-600 hover:bg-gray-50"
                                onClick={() => handleStatusChange(unit, 'used')}
                              >
                                Use
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => openTransferDialog(unit.location)}
                              >
                                <MoveRight className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {unit.status === 'reserved' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleStatusChange(unit, 'available')}
                              >
                                Unreserve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-gray-600 border-gray-600 hover:bg-gray-50"
                                onClick={() => handleStatusChange(unit, 'used')}
                              >
                                Use
                              </Button>
                            </>
                          )}
                          {daysToExpiry <= 0 && unit.status !== 'expired' && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleStatusChange(unit, 'expired')}
                            >
                              Mark Expired
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="expiry" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Card className="border-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <ArchiveX className="h-5 w-5" />
                  Expiring Soon ({expiringSoon.length} units)
                </CardTitle>
                <CardDescription>
                  Blood units expiring within the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expiringSoon.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No blood units expiring soon</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Days Left</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiringSoon.map((unit) => {
                        const expiryDate = new Date(unit.expiryDate);
                        const now = new Date();
                        const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <TableRow key={unit.id}>
                            <TableCell className="font-mono text-sm">{unit.id}</TableCell>
                            <TableCell>
                              <span className="bg-red-100 text-red-800 rounded-full px-3 py-1">
                                {unit.bloodGroup}
                              </span>
                            </TableCell>
                            <TableCell>{unit.volume} ml</TableCell>
                            <TableCell>{unit.expiryDate}</TableCell>
                            <TableCell>
                              <Badge className={`${
                                daysToExpiry <= 3 ? 'bg-red-100 text-red-800 border-red-300' : 
                                'bg-amber-100 text-amber-800 border-amber-300'
                              }`}>
                                {daysToExpiry} days
                              </Badge>
                            </TableCell>
                            <TableCell>{unit.location}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  onClick={() => openTransferDialog(unit.location)}
                                >
                                  Transfer
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleStatusChange(unit, 'expired')}
                                >
                                  Discard
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TransferIcon className="h-5 w-5" />
                  Transfer Management
                </CardTitle>
                <CardDescription>
                  Manage transfers between storage locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Schedule Transfer</h3>
                        <p className="text-gray-500 text-sm mb-4">Create a new blood units transfer</p>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => openTransferDialog()}
                        >
                          New Transfer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Emergency Request</h3>
                        <p className="text-gray-500 text-sm mb-4">Request emergency blood from external bank</p>
                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          Request Units
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Share Excess</h3>
                        <p className="text-gray-500 text-sm mb-4">Share excess units with other facilities</p>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Share Units
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-semibold mb-4">Recent Transfers</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransfers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No recent transfers
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentTransfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell>{transfer.transferDate}</TableCell>
                          <TableCell>{transfer.fromLocation}</TableCell>
                          <TableCell>{transfer.toLocation}</TableCell>
                          <TableCell>
                            {transfer.units.length} x {
                              transfer.units.length > 1 
                                ? 'Multiple groups' 
                                : transfer.units[0].bloodGroup
                            }
                          </TableCell>
                          <TableCell>
                            <Badge className={`
                              ${transfer.status === 'completed' 
                                ? 'bg-green-100 text-green-800 border-green-300' 
                                : transfer.status === 'in-transit'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : transfer.status === 'requested'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-gray-100 text-gray-800 border-gray-300'}
                            `}>
                              {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <TransferDialog 
        open={isTransferDialogOpen} 
        onOpenChange={setIsTransferDialogOpen}
        fromLocation={transferFromLocation}
      />
    </div>
  );
};

export default BloodStockManagementTab;
