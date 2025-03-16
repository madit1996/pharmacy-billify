
import { useState } from "react";
import { 
  BedDouble, 
  User, 
  Check, 
  X, 
  Plus, 
  UserCheck, 
  Filter,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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

// Ward and bed data
const initialWards = [
  {
    id: 1,
    name: "ICU",
    type: "Critical Care",
    totalBeds: 10,
    availableBeds: 3,
    beds: Array(10).fill(null).map((_, i) => ({
      id: `ICU-${i+1}`,
      status: Math.random() > 0.3 ? "occupied" : "available",
      patientId: Math.random() > 0.3 ? Math.floor(Math.random() * 1000) : null,
      patientName: Math.random() > 0.3 ? ["Budi Santoso", "Sri Wulandari", "Ahmad Hidayat", "Dewi Sartika", "Joko Widodo"][Math.floor(Math.random() * 5)] : null,
      admissionDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
      expectedDischarge: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000) : null,
    }))
  },
  {
    id: 2,
    name: "General Ward",
    type: "Standard Care",
    totalBeds: 30,
    availableBeds: 12,
    beds: Array(30).fill(null).map((_, i) => ({
      id: `GW-${i+1}`,
      status: Math.random() > 0.4 ? "occupied" : "available",
      patientId: Math.random() > 0.4 ? Math.floor(Math.random() * 1000) : null,
      patientName: Math.random() > 0.4 ? ["Siti Rahayu", "Bambang Suprapto", "Rina Wati", "Hendra Setiawan", "Lina Marlina"][Math.floor(Math.random() * 5)] : null,
      admissionDate: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : null,
      expectedDischarge: Math.random() > 0.4 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
    }))
  },
  {
    id: 3,
    name: "Pediatric Ward",
    type: "Specialized Care",
    totalBeds: 15,
    availableBeds: 5,
    beds: Array(15).fill(null).map((_, i) => ({
      id: `PED-${i+1}`,
      status: Math.random() > 0.35 ? "occupied" : "available",
      patientId: Math.random() > 0.35 ? Math.floor(Math.random() * 1000) : null,
      patientName: Math.random() > 0.35 ? ["Dimas Putra", "Nadia Putri", "Rizki Rahman", "Maya Sari", "Andi Wijaya"][Math.floor(Math.random() * 5)] : null,
      admissionDate: Math.random() > 0.35 ? new Date(Date.now() - Math.random() * 8 * 24 * 60 * 60 * 1000) : null,
      expectedDischarge: Math.random() > 0.35 ? new Date(Date.now() + Math.random() * 6 * 24 * 60 * 60 * 1000) : null,
    }))
  },
  {
    id: 4,
    name: "Maternity Ward",
    type: "Specialized Care",
    totalBeds: 12,
    availableBeds: 3,
    beds: Array(12).fill(null).map((_, i) => ({
      id: `MAT-${i+1}`,
      status: Math.random() > 0.25 ? "occupied" : "available",
      patientId: Math.random() > 0.25 ? Math.floor(Math.random() * 1000) : null,
      patientName: Math.random() > 0.25 ? ["Ratna Dewi", "Susi Susanti", "Tuti Winarti", "Ani Yudhoyono", "Nina Setiawati"][Math.floor(Math.random() * 5)] : null,
      admissionDate: Math.random() > 0.25 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) : null,
      expectedDischarge: Math.random() > 0.25 ? new Date(Date.now() + Math.random() * 4 * 24 * 60 * 60 * 1000) : null,
    }))
  }
];

// Sample patients for bed assignment dialog
const samplePatients = [
  { id: 1001, name: "Anwar Ibrahim", gender: "Male", age: 42, diagnosis: "Pneumonia" },
  { id: 1002, name: "Siti Nurhaliza", gender: "Female", age: 35, diagnosis: "Post-surgery recovery" },
  { id: 1003, name: "Taufik Hidayat", gender: "Male", age: 28, diagnosis: "Fractured leg" },
  { id: 1004, name: "Raisa Andriana", gender: "Female", age: 32, diagnosis: "Childbirth" },
  { id: 1005, name: "Ridwan Kamil", gender: "Male", age: 45, diagnosis: "Cardiac monitoring" },
];

// Occupancy data for charts
const occupancyData = [
  { name: "ICU", available: 3, occupied: 7 },
  { name: "General Ward", available: 12, occupied: 18 },
  { name: "Pediatric Ward", available: 5, occupied: 10 },
  { name: "Maternity Ward", available: 3, occupied: 9 },
];

const bedTurnoverData = [
  { name: "ICU", turnover: 3.2 },
  { name: "General Ward", turnover: 5.8 },
  { name: "Pediatric Ward", turnover: 4.5 },
  { name: "Maternity Ward", turnover: 7.2 },
];

const averageStayData = [
  { name: "ICU", days: 4.5 },
  { name: "General Ward", days: 3.2 },
  { name: "Pediatric Ward", days: 2.8 },
  { name: "Maternity Ward", days: 2.3 },
];

const BedManagementPage = () => {
  const [wards, setWards] = useState(initialWards);
  const [selectedWard, setSelectedWard] = useState(initialWards[0]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const handleBedClick = (bed: any) => {
    setSelectedBed(bed);
    
    if (bed.status === "available") {
      setIsAssignDialogOpen(true);
    } else {
      // Show bed details or discharge dialog
      console.log("Bed details:", bed);
    }
  };
  
  const handleAssignBed = () => {
    if (!selectedBed || !selectedPatient) return;
    
    // Update the bed status and patient info
    const updatedWards = wards.map(ward => {
      if (ward.id === selectedWard.id) {
        const updatedBeds = ward.beds.map(bed => {
          if (bed.id === selectedBed.id) {
            return {
              ...bed,
              status: "occupied",
              patientId: selectedPatient.id,
              patientName: selectedPatient.name,
              admissionDate: new Date(),
              expectedDischarge: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            };
          }
          return bed;
        });
        
        return {
          ...ward,
          beds: updatedBeds,
          availableBeds: ward.availableBeds - 1
        };
      }
      return ward;
    });
    
    setWards(updatedWards);
    setSelectedWard(updatedWards.find(w => w.id === selectedWard.id)!);
    setIsAssignDialogOpen(false);
    setSelectedBed(null);
    setSelectedPatient(null);
  };
  
  const dischargeBed = (wardId: number, bedId: string) => {
    const updatedWards = wards.map(ward => {
      if (ward.id === wardId) {
        const updatedBeds = ward.beds.map(bed => {
          if (bed.id === bedId) {
            return {
              ...bed,
              status: "available",
              patientId: null,
              patientName: null,
              admissionDate: null,
              expectedDischarge: null,
            };
          }
          return bed;
        });
        
        return {
          ...ward,
          beds: updatedBeds,
          availableBeds: ward.availableBeds + 1
        };
      }
      return ward;
    });
    
    setWards(updatedWards);
    setSelectedWard(updatedWards.find(w => w.id === selectedWard.id)!);
  };
  
  // Filter beds based on search term
  const filteredBeds = selectedWard.beds.filter(bed => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      bed.id.toLowerCase().includes(searchLower) ||
      (bed.patientName && bed.patientName.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="container mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-6">Bed Management</h1>
      
      <Tabs defaultValue="beds" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="beds">Bed Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="beds" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <Select 
                  value={selectedWard.id.toString()} 
                  onValueChange={(value) => setSelectedWard(wards.find(w => w.id === parseInt(value))!)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map(ward => (
                      <SelectItem key={ward.id} value={ward.id.toString()}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    Grid View
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    List View
                  </Button>
                </div>
              </div>
              
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bed or patient..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-4 flex flex-wrap gap-3">
              <Badge variant="outline" className="bg-white">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                Available ({selectedWard.availableBeds})
              </Badge>
              <Badge variant="outline" className="bg-white">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                Occupied ({selectedWard.totalBeds - selectedWard.availableBeds})
              </Badge>
              <Badge variant="outline" className="bg-white flex items-center">
                Total Beds: {selectedWard.totalBeds}
              </Badge>
              <Badge variant="outline" className="bg-white flex items-center">
                Occupancy Rate: {Math.round(((selectedWard.totalBeds - selectedWard.availableBeds) / selectedWard.totalBeds) * 100)}%
              </Badge>
            </div>
            
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {filteredBeds.map((bed) => (
                  <div
                    key={bed.id}
                    className={`border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors ${
                      bed.status === "available" ? "bg-green-50" : "bg-red-50"
                    }`}
                    onClick={() => handleBedClick(bed)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{bed.id}</div>
                      {bed.status === "available" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    
                    {bed.status === "occupied" && (
                      <div className="mt-2 text-sm">
                        <div className="font-medium truncate">{bed.patientName}</div>
                        <div className="text-gray-500 text-xs">
                          ID: {bed.patientId}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Admitted: {bed.admissionDate.toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    
                    {bed.status === "available" && (
                      <div className="mt-3 flex items-center justify-center">
                        <Button size="sm" className="w-full" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBed(bed);
                          setIsAssignDialogOpen(true);
                        }}>
                          <Plus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      </div>
                    )}
                    
                    {bed.status === "occupied" && (
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            dischargeBed(selectedWard.id, bed.id);
                          }}
                        >
                          Discharge
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bed ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Expected Discharge</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBeds.map((bed) => (
                      <TableRow key={bed.id}>
                        <TableCell>{bed.id}</TableCell>
                        <TableCell>
                          <Badge variant={bed.status === "available" ? "success" : "destructive"}>
                            {bed.status === "available" ? "Available" : "Occupied"}
                          </Badge>
                        </TableCell>
                        <TableCell>{bed.patientName || "-"}</TableCell>
                        <TableCell>{bed.patientId || "-"}</TableCell>
                        <TableCell>{bed.admissionDate ? bed.admissionDate.toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{bed.expectedDischarge ? bed.expectedDischarge.toLocaleDateString() : "-"}</TableCell>
                        <TableCell>
                          {bed.status === "available" ? (
                            <Button size="sm" onClick={() => {
                              setSelectedBed(bed);
                              setIsAssignDialogOpen(true);
                            }}>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Assign
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => dischargeBed(selectedWard.id, bed.id)}
                            >
                              Discharge
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
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
        </TabsContent>
      </Tabs>
      
      {/* Assign Bed Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Patient to Bed {selectedBed?.id}</DialogTitle>
            <DialogDescription>
              Select a patient to assign to this bed
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-8"
              />
            </div>
            
            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              {samplePatients.map(patient => (
                <div
                  key={patient.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedPatient?.id === patient.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">
                        ID: {patient.id} • {patient.gender}, {patient.age} yrs • {patient.diagnosis}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignBed} disabled={!selectedPatient}>
              Assign Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BedManagementPage;
