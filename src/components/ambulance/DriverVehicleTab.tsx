
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Truck, User, Phone } from "lucide-react";

type Vehicle = {
  id: string;
  vehicleNumber: string;
  type: "Basic" | "Advanced" | "ICU";
  status: "Available" | "On Duty" | "Maintenance" | "Out of Service";
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  lastService: string;
  fuelLevel: number;
  equipment: string[];
};

const DriverVehicleTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const vehicles: Vehicle[] = [
    {
      id: "1",
      vehicleNumber: "AMB-001",
      type: "ICU",
      status: "On Duty",
      driverName: "John Driver",
      driverPhone: "+91 9876543210",
      currentLocation: "Downtown Area",
      lastService: "2024-01-10",
      fuelLevel: 85,
      equipment: ["Ventilator", "Defibrillator", "Oxygen", "Cardiac Monitor"]
    },
    {
      id: "2",
      vehicleNumber: "AMB-002",
      type: "Advanced",
      status: "Available",
      driverName: "Mike Johnson",
      driverPhone: "+91 9876543211",
      currentLocation: "Hospital Base",
      lastService: "2024-01-12",
      fuelLevel: 92,
      equipment: ["First Aid", "Oxygen", "Stretcher", "Basic Monitors"]
    },
    {
      id: "3",
      vehicleNumber: "AMB-003",
      type: "Basic",
      status: "Maintenance",
      driverName: "Tom Wilson",
      driverPhone: "+91 9876543212",
      currentLocation: "Service Center",
      lastService: "2024-01-15",
      fuelLevel: 0,
      equipment: ["First Aid", "Stretcher", "Oxygen"]
    }
  ];

  const statuses = ["all", "Available", "On Duty", "Maintenance", "Out of Service"];
  const types = ["all", "Basic", "Advanced", "ICU"];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: Vehicle["status"]) => {
    const statusConfig = {
      "Available": "bg-green-100 text-green-800",
      "On Duty": "bg-blue-100 text-blue-800",
      "Maintenance": "bg-yellow-100 text-yellow-800",
      "Out of Service": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: Vehicle["type"]) => {
    const typeConfig = {
      "Basic": "bg-gray-100 text-gray-800",
      "Advanced": "bg-blue-100 text-blue-800",
      "ICU": "bg-purple-100 text-purple-800"
    };

    return (
      <Badge className={typeConfig[type]}>
        {type}
      </Badge>
    );
  };

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return "text-green-600";
    if (level > 25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Driver & Vehicle Management</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by vehicle number or driver name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicles Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Current Location</TableHead>
                  <TableHead>Fuel Level</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        <span className="font-medium">{vehicle.vehicleNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(vehicle.type)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vehicle.driverName}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {vehicle.driverPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.currentLocation}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getFuelLevelColor(vehicle.fuelLevel)}`}>
                        {vehicle.fuelLevel}%
                      </span>
                    </TableCell>
                    <TableCell>{vehicle.lastService}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {vehicle.equipment.slice(0, 2).join(", ")}
                        {vehicle.equipment.length > 2 && "..."}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        {vehicle.status === "Available" && (
                          <Button variant="outline" size="sm">
                            Assign
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverVehicleTab;
