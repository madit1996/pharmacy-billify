
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, FileText } from "lucide-react";

type IssueRecord = {
  id: string;
  issueId: string;
  department: string;
  requestedBy: string;
  items: { name: string; quantity: number; unit: string }[];
  issueDate: string;
  status: "Pending" | "Approved" | "Issued" | "Rejected";
  totalValue: number;
};

const DepartmentIssueTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const issueRecords: IssueRecord[] = [
    {
      id: "1",
      issueId: "ISS001",
      department: "Cardiology",
      requestedBy: "Dr. Sarah Johnson",
      items: [
        { name: "Surgical Gloves", quantity: 10, unit: "Box" },
        { name: "ECG Electrodes", quantity: 50, unit: "Piece" }
      ],
      issueDate: "2024-01-15",
      status: "Approved",
      totalValue: 3500
    },
    {
      id: "2",
      issueId: "ISS002",
      department: "Emergency",
      requestedBy: "Nurse Mary Wilson",
      items: [
        { name: "IV Cannula", quantity: 20, unit: "Piece" },
        { name: "Bandages", quantity: 5, unit: "Roll" }
      ],
      issueDate: "2024-01-16",
      status: "Pending",
      totalValue: 1200
    }
  ];

  const departments = ["all", "Cardiology", "Emergency", "Orthopedics", "Radiology", "Laboratory"];
  const statuses = ["all", "Pending", "Approved", "Issued", "Rejected"];

  const filteredRecords = issueRecords.filter(record => {
    const matchesSearch = record.issueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: IssueRecord["status"]) => {
    const statusConfig = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Approved": "bg-green-100 text-green-800",
      "Issued": "bg-blue-100 text-blue-800",
      "Rejected": "bg-red-100 text-red-800"
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
            <CardTitle>Department Issue Log</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Issue Request
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by issue ID or requester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
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

          {/* Issues Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.issueId}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.requestedBy}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {record.items.map((item, index) => (
                          <div key={index}>
                            {item.name} ({item.quantity} {item.unit})
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{record.issueDate}</TableCell>
                    <TableCell>₹{record.totalValue.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
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

export default DepartmentIssueTab;
