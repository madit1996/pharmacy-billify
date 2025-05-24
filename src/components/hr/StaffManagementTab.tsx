
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import AddStaffDialog from "./AddStaffDialog";
import StaffDetailsDialog from "./StaffDetailsDialog";

type Staff = {
  id: string;
  staffId: string;
  name: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave";
  certifications: string[];
  experience: string;
  salary: string;
  address: string;
  emergencyContact: string;
};

const StaffManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const staffData: Staff[] = [
    {
      id: "1",
      staffId: "EMP001",
      name: "Dr. Sarah Johnson",
      department: "Cardiology",
      designation: "Senior Doctor",
      phone: "+91 9876543210",
      email: "sarah.johnson@hospital.com",
      joinDate: "2020-03-15",
      status: "Active",
      certifications: ["MBBS", "MD Cardiology", "Fellowship in Interventional Cardiology"],
      experience: "8 years",
      salary: "₹1,20,000",
      address: "123 Medical Street, Healthcare City",
      emergencyContact: "+91 9876543211"
    },
    {
      id: "2",
      staffId: "EMP002",
      name: "Nurse Mary Wilson",
      department: "Emergency",
      designation: "Staff Nurse",
      phone: "+91 9876543212",
      email: "mary.wilson@hospital.com",
      joinDate: "2021-07-10",
      status: "Active",
      certifications: ["BSc Nursing", "Critical Care Certification"],
      experience: "5 years",
      salary: "₹45,000",
      address: "456 Care Lane, Medical District",
      emergencyContact: "+91 9876543213"
    },
    {
      id: "3",
      staffId: "EMP003",
      name: "Dr. Michael Brown",
      department: "Orthopedics",
      designation: "Consultant",
      phone: "+91 9876543214",
      email: "michael.brown@hospital.com",
      joinDate: "2019-01-20",
      status: "On Leave",
      certifications: ["MBBS", "MS Orthopedics"],
      experience: "12 years",
      salary: "₹1,50,000",
      address: "789 Bone Avenue, Orthopedic Plaza",
      emergencyContact: "+91 9876543215"
    }
  ];

  const departments = ["all", "Cardiology", "Emergency", "Orthopedics", "Radiology", "Pharmacy", "Administration"];
  const statusOptions = ["all", "Active", "Inactive", "On Leave"];

  const filteredData = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || staff.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: Staff["status"]) => {
    const statusConfig = {
      "Active": "bg-green-100 text-green-800",
      "Inactive": "bg-red-100 text-red-800",
      "On Leave": "bg-yellow-100 text-yellow-800"
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
            <CardTitle>Staff Management</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <AddStaffDialog onClose={() => setIsAddDialogOpen(false)} />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search staff by name, ID, or email..."
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
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.staffId}</TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{staff.designation}</TableCell>
                    <TableCell>{staff.joinDate}</TableCell>
                    <TableCell>{getStatusBadge(staff.status)}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStaff(staff)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
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

      {/* Staff Details Dialog */}
      {selectedStaff && (
        <StaffDetailsDialog 
          staff={selectedStaff} 
          onClose={() => setSelectedStaff(null)} 
        />
      )}
    </div>
  );
};

export default StaffManagementTab;
