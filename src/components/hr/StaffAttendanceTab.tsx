
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Download, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day";

type StaffAttendance = {
  id: string;
  staffId: string;
  name: string;
  department: string;
  designation: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  workingHours: string;
  overtime: string;
};

const StaffAttendanceTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const attendanceData: StaffAttendance[] = [
    {
      id: "1",
      staffId: "EMP001",
      name: "Dr. Sarah Johnson",
      department: "Cardiology",
      designation: "Senior Doctor",
      checkIn: "08:30",
      checkOut: "17:30",
      status: "Present",
      workingHours: "9:00",
      overtime: "0:00"
    },
    {
      id: "2",
      staffId: "EMP002",
      name: "Nurse Mary Wilson",
      department: "Emergency",
      designation: "Staff Nurse",
      checkIn: "09:15",
      checkOut: "18:00",
      status: "Late",
      workingHours: "8:45",
      overtime: "0:00"
    },
    {
      id: "3",
      staffId: "EMP003",
      name: "Dr. Michael Brown",
      department: "Orthopedics",
      designation: "Consultant",
      checkIn: "08:00",
      checkOut: "16:30",
      status: "Present",
      workingHours: "8:30",
      overtime: "0:00"
    },
    {
      id: "4",
      staffId: "EMP004",
      name: "Technician John Smith",
      department: "Radiology",
      designation: "Lab Technician",
      checkIn: "-",
      checkOut: "-",
      status: "Absent",
      workingHours: "0:00",
      overtime: "0:00"
    }
  ];

  const departments = ["all", "Cardiology", "Emergency", "Orthopedics", "Radiology", "Pharmacy", "Administration"];

  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getStatusBadge = (status: AttendanceStatus) => {
    const statusConfig = {
      "Present": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "Absent": { color: "bg-red-100 text-red-800", icon: XCircle },
      "Late": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Half Day": { color: "bg-blue-100 text-blue-800", icon: Clock }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance for {format(selectedDate, "MMMM dd, yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or staff ID..."
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

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Attendance Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Overtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.staffId}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.designation}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.workingHours}</TableCell>
                    <TableCell>{record.overtime}</TableCell>
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

export default StaffAttendanceTab;
