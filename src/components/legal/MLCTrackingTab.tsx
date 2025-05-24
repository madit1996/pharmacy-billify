
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, AlertTriangle, Eye, FileText } from "lucide-react";

type MLCCase = {
  id: string;
  mlcNumber: string;
  patientName: string;
  age: number;
  gender: string;
  caseType: "Accident" | "Assault" | "Poisoning" | "Burn" | "Sexual Assault" | "Other";
  policeStation: string;
  officerName: string;
  admissionDate: string;
  status: "Active" | "Under Investigation" | "Legal Proceedings" | "Closed";
  priority: "High" | "Medium" | "Low";
  lastUpdated: string;
};

const MLCTrackingTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const mlcCases: MLCCase[] = [
    {
      id: "1",
      mlcNumber: "MLC001/2024",
      patientName: "John Doe",
      age: 28,
      gender: "Male",
      caseType: "Accident",
      policeStation: "City Police Station",
      officerName: "Inspector Smith",
      admissionDate: "2024-01-15",
      status: "Active",
      priority: "High",
      lastUpdated: "2024-01-17"
    },
    {
      id: "2",
      mlcNumber: "MLC002/2024",
      patientName: "Jane Wilson",
      age: 35,
      gender: "Female",
      caseType: "Assault",
      policeStation: "Metro Police Station",
      officerName: "Inspector Brown",
      admissionDate: "2024-01-16",
      status: "Under Investigation",
      priority: "High",
      lastUpdated: "2024-01-18"
    },
    {
      id: "3",
      mlcNumber: "MLC003/2024",
      patientName: "Robert Johnson",
      age: 45,
      gender: "Male",
      caseType: "Poisoning",
      policeStation: "Central Police Station",
      officerName: "Inspector Davis",
      admissionDate: "2024-01-14",
      status: "Legal Proceedings",
      priority: "Medium",
      lastUpdated: "2024-01-16"
    }
  ];

  const statuses = ["all", "Active", "Under Investigation", "Legal Proceedings", "Closed"];
  const priorities = ["all", "High", "Medium", "Low"];

  const filteredCases = mlcCases.filter(mlcCase => {
    const matchesSearch = mlcCase.mlcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mlcCase.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || mlcCase.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || mlcCase.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: MLCCase["status"]) => {
    const statusConfig = {
      "Active": "bg-red-100 text-red-800",
      "Under Investigation": "bg-yellow-100 text-yellow-800",
      "Legal Proceedings": "bg-blue-100 text-blue-800",
      "Closed": "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: MLCCase["priority"]) => {
    const priorityConfig = {
      "High": "bg-red-100 text-red-800",
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
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Medico-Legal Cases (MLC) Tracking
            </CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register MLC
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by MLC number or patient name..."
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

          {/* MLC Cases Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MLC Number</TableHead>
                  <TableHead>Patient Details</TableHead>
                  <TableHead>Case Type</TableHead>
                  <TableHead>Police Station</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((mlcCase) => (
                  <TableRow key={mlcCase.id}>
                    <TableCell className="font-medium">{mlcCase.mlcNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{mlcCase.patientName}</p>
                        <p className="text-sm text-gray-600">{mlcCase.age}Y, {mlcCase.gender}</p>
                      </div>
                    </TableCell>
                    <TableCell>{mlcCase.caseType}</TableCell>
                    <TableCell>{mlcCase.policeStation}</TableCell>
                    <TableCell>{mlcCase.officerName}</TableCell>
                    <TableCell>{mlcCase.admissionDate}</TableCell>
                    <TableCell>{getPriorityBadge(mlcCase.priority)}</TableCell>
                    <TableCell>{getStatusBadge(mlcCase.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
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

export default MLCTrackingTab;
