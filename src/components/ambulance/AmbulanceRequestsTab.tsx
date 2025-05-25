
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock } from "lucide-react";
import AmbulanceRequestDialog from "./AmbulanceRequestDialog";
import ViewDetailsDialog from "../shared/ViewDetailsDialog";
import VehicleAssignDialog from "./VehicleAssignDialog";

type AmbulanceRequest = {
  id: string;
  requestId: string;
  patientName: string;
  contactNumber: string;
  pickupLocation: string;
  destination: string;
  requestTime: string;
  priority: "Emergency" | "High" | "Medium" | "Low";
  status: "Pending" | "Assigned" | "En Route" | "Completed" | "Cancelled";
  assignedVehicle?: string;
  estimatedArrival?: string;
};

const AmbulanceRequestsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const ambulanceRequests: AmbulanceRequest[] = [
    {
      id: "1",
      requestId: "AMB001",
      patientName: "John Doe",
      contactNumber: "+91 9876543210",
      pickupLocation: "123 Main Street, City Center",
      destination: "City Hospital",
      requestTime: "14:30",
      priority: "Emergency",
      status: "Completed",
      assignedVehicle: "AMB-001",
      estimatedArrival: "14:45"
    },
    {
      id: "2",
      requestId: "AMB002",
      patientName: "Jane Smith",
      contactNumber: "+91 9876543211",
      pickupLocation: "456 Oak Avenue, Downtown",
      destination: "Metro Hospital",
      requestTime: "15:15",
      priority: "High",
      status: "En Route",
      assignedVehicle: "AMB-002",
      estimatedArrival: "15:35"
    },
    {
      id: "3",
      requestId: "AMB003",
      patientName: "Robert Wilson",
      contactNumber: "+91 9876543212",
      pickupLocation: "789 Pine Street, Suburb",
      destination: "General Hospital",
      requestTime: "16:00",
      priority: "Medium",
      status: "Pending"
    }
  ];

  const statuses = ["all", "Pending", "Assigned", "En Route", "Completed", "Cancelled"];
  const priorities = ["all", "Emergency", "High", "Medium", "Low"];

  const filteredRequests = ambulanceRequests.filter(request => {
    const matchesSearch = request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: AmbulanceRequest["status"]) => {
    const statusConfig = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Assigned": "bg-blue-100 text-blue-800",
      "En Route": "bg-orange-100 text-orange-800",
      "Completed": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: AmbulanceRequest["priority"]) => {
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
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Ambulance Requests
            </CardTitle>
            <AmbulanceRequestDialog />
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by request ID or patient name..."
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

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority === "all" ? "All Priorities" : priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Requests Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Pickup Location</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Request Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.requestId}</TableCell>
                    <TableCell>{request.patientName}</TableCell>
                    <TableCell>{request.contactNumber}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.pickupLocation}</TableCell>
                    <TableCell>{request.destination}</TableCell>
                    <TableCell>{request.requestTime}</TableCell>
                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <ViewDetailsDialog
                          title={`Ambulance Request - ${request.requestId}`}
                          data={{
                            "Request ID": request.requestId,
                            "Patient Name": request.patientName,
                            "Contact Number": request.contactNumber,
                            "Pickup Location": request.pickupLocation,
                            "Destination": request.destination,
                            "Request Time": request.requestTime,
                            "Priority": request.priority,
                            "Status": request.status,
                            "Assigned Vehicle": request.assignedVehicle || "Not assigned",
                            "Estimated Arrival": request.estimatedArrival || "N/A"
                          }}
                        />
                        {request.status === "Pending" && (
                          <VehicleAssignDialog requestId={request.requestId} />
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

export default AmbulanceRequestsTab;
