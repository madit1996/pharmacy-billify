
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Phone, MapPin, Clock } from "lucide-react";

type AmbulanceRequest = {
  id: string;
  requestId: string;
  patientName: string;
  callerName: string;
  callerPhone: string;
  pickupLocation: string;
  destination: string;
  requestTime: string;
  priority: "Emergency" | "High" | "Medium" | "Low";
  status: "Pending" | "Assigned" | "En Route" | "Arrived" | "Completed" | "Cancelled";
  medicalCondition: string;
  specialRequirements: string;
};

const AmbulanceRequestsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const ambulanceRequests: AmbulanceRequest[] = [
    {
      id: "1",
      requestId: "AMB001",
      patientName: "John Doe",
      callerName: "Mary Doe",
      callerPhone: "+91 9876543210",
      pickupLocation: "123 Main Street, Downtown",
      destination: "City Hospital Emergency",
      requestTime: "2024-01-17 14:30",
      priority: "Emergency",
      status: "En Route",
      medicalCondition: "Chest Pain",
      specialRequirements: "Oxygen Support"
    },
    {
      id: "2",
      requestId: "AMB002",
      patientName: "Jane Smith",
      callerName: "Robert Smith",
      callerPhone: "+91 9876543211",
      pickupLocation: "456 Oak Avenue, Suburb",
      destination: "Metro Hospital",
      requestTime: "2024-01-17 15:15",
      priority: "High",
      status: "Assigned",
      medicalCondition: "Pregnancy Emergency",
      specialRequirements: "Female Attendant"
    },
    {
      id: "3",
      requestId: "AMB003",
      patientName: "Robert Wilson",
      callerName: "Self",
      callerPhone: "+91 9876543212",
      pickupLocation: "789 Pine Street, Uptown",
      destination: "General Hospital",
      requestTime: "2024-01-17 16:00",
      priority: "Medium",
      status: "Pending",
      medicalCondition: "Fracture",
      specialRequirements: "Stretcher"
    }
  ];

  const priorities = ["all", "Emergency", "High", "Medium", "Low"];
  const statuses = ["all", "Pending", "Assigned", "En Route", "Arrived", "Completed", "Cancelled"];

  const filteredRequests = ambulanceRequests.filter(request => {
    const matchesSearch = request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

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

  const getStatusBadge = (status: AmbulanceRequest["status"]) => {
    const statusConfig = {
      "Pending": "bg-gray-100 text-gray-800",
      "Assigned": "bg-blue-100 text-blue-800",
      "En Route": "bg-yellow-100 text-yellow-800",
      "Arrived": "bg-orange-100 text-orange-800",
      "Completed": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ambulance Requests</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log New Request
            </Button>
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

          {/* Requests Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Caller</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Condition</TableHead>
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
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.callerName}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {request.callerPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          From: {request.pickupLocation.substring(0, 20)}...
                        </p>
                        <p>To: {request.destination}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.medicalCondition}</p>
                        <p className="text-sm text-gray-600">{request.specialRequirements}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {request.requestTime}
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {request.status === "Pending" && (
                          <Button variant="outline" size="sm">
                            Assign
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View
                        </Button>
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
