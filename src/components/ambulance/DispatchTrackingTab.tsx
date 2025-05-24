
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Route } from "lucide-react";

type DispatchRecord = {
  id: string;
  requestId: string;
  vehicleNumber: string;
  driverName: string;
  patientName: string;
  dispatchTime: string;
  estimatedArrival: string;
  actualArrival: string;
  completionTime: string;
  pickupLocation: string;
  destination: string;
  distance: string;
  status: "Dispatched" | "En Route" | "Arrived" | "Patient Picked" | "Completed";
  priority: "Emergency" | "High" | "Medium" | "Low";
};

const DispatchTrackingTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const dispatchRecords: DispatchRecord[] = [
    {
      id: "1",
      requestId: "AMB001",
      vehicleNumber: "AMB-001",
      driverName: "John Driver",
      patientName: "John Doe",
      dispatchTime: "14:30",
      estimatedArrival: "14:45",
      actualArrival: "14:42",
      completionTime: "15:30",
      pickupLocation: "123 Main Street",
      destination: "City Hospital",
      distance: "8.5 km",
      status: "Completed",
      priority: "Emergency"
    },
    {
      id: "2",
      requestId: "AMB002",
      vehicleNumber: "AMB-002",
      driverName: "Mike Johnson",
      patientName: "Jane Smith",
      dispatchTime: "15:15",
      estimatedArrival: "15:35",
      actualArrival: "15:32",
      completionTime: "",
      pickupLocation: "456 Oak Avenue",
      destination: "Metro Hospital",
      distance: "12.3 km",
      status: "Patient Picked",
      priority: "High"
    },
    {
      id: "3",
      requestId: "AMB003",
      vehicleNumber: "AMB-003",
      driverName: "Tom Wilson",
      patientName: "Robert Wilson",
      dispatchTime: "16:00",
      estimatedArrival: "16:20",
      actualArrival: "",
      completionTime: "",
      pickupLocation: "789 Pine Street",
      destination: "General Hospital",
      distance: "6.8 km",
      status: "En Route",
      priority: "Medium"
    }
  ];

  const statuses = ["all", "Dispatched", "En Route", "Arrived", "Patient Picked", "Completed"];

  const filteredRecords = dispatchRecords.filter(record => {
    const matchesSearch = record.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: DispatchRecord["status"]) => {
    const statusConfig = {
      "Dispatched": "bg-blue-100 text-blue-800",
      "En Route": "bg-yellow-100 text-yellow-800",
      "Arrived": "bg-orange-100 text-orange-800",
      "Patient Picked": "bg-purple-100 text-purple-800",
      "Completed": "bg-green-100 text-green-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: DispatchRecord["priority"]) => {
    const priorityConfig = {
      "Emergency": "bg-red-100 text-red-800",
      "High": "bg-orange-100 text-orange-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "Low": "bg-green-100 text-green-800"
    };

    return (
      <Badge className={priorityConfig[priority]}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Route className="mr-2 h-5 w-5" />
            Dispatch Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by request ID, vehicle, or patient name..."
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
          </div>

          {/* Dispatch Records Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Vehicle & Driver</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.requestId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.vehicleNumber}</p>
                        <p className="text-sm text-gray-600">{record.driverName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{record.patientName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {record.pickupLocation.substring(0, 15)}...
                        </p>
                        <p>→ {record.destination}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Dispatch: {record.dispatchTime}
                        </p>
                        <p>ETA: {record.estimatedArrival}</p>
                        {record.actualArrival && (
                          <p>Arrived: {record.actualArrival}</p>
                        )}
                        {record.completionTime && (
                          <p>Completed: {record.completionTime}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{record.distance}</TableCell>
                    <TableCell>{getPriorityBadge(record.priority)}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
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

export default DispatchTrackingTab;
