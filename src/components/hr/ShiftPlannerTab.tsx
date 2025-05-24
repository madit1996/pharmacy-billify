
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit, Clock, Users } from "lucide-react";
import { format } from "date-fns";

type ShiftType = "Morning" | "Evening" | "Night" | "Day";

type Shift = {
  id: string;
  shiftName: string;
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  department: string;
  staffAssigned: string[];
  date: string;
  maxCapacity: number;
};

const ShiftPlannerTab = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const shifts: Shift[] = [
    {
      id: "S001",
      shiftName: "Emergency Morning",
      shiftType: "Morning",
      startTime: "06:00",
      endTime: "14:00",
      department: "Emergency",
      staffAssigned: ["Dr. Sarah Johnson", "Nurse Mary Wilson", "Nurse Katie Davis"],
      date: "2024-01-15",
      maxCapacity: 5
    },
    {
      id: "S002",
      shiftName: "ICU Night",
      shiftType: "Night",
      startTime: "22:00",
      endTime: "06:00",
      department: "ICU",
      staffAssigned: ["Dr. Michael Brown", "Nurse John Doe"],
      date: "2024-01-15",
      maxCapacity: 4
    },
    {
      id: "S003",
      shiftName: "OPD Day",
      shiftType: "Day",
      startTime: "08:00",
      endTime: "20:00",
      department: "OPD",
      staffAssigned: ["Dr. Emily Clark", "Receptionist Alice"],
      date: "2024-01-15",
      maxCapacity: 6
    },
    {
      id: "S004",
      shiftName: "Surgery Evening",
      shiftType: "Evening",
      startTime: "14:00",
      endTime: "22:00",
      department: "Surgery",
      staffAssigned: ["Dr. Robert Wilson"],
      date: "2024-01-15",
      maxCapacity: 3
    }
  ];

  const departments = ["all", "Emergency", "ICU", "OPD", "Surgery", "Radiology", "Laboratory"];
  
  const filteredShifts = shifts.filter(shift => 
    selectedDepartment === "all" || shift.department === selectedDepartment
  );

  const getShiftTypeBadge = (shiftType: ShiftType) => {
    const typeConfig = {
      "Morning": { color: "bg-blue-100 text-blue-800" },
      "Evening": { color: "bg-orange-100 text-orange-800" },
      "Night": { color: "bg-purple-100 text-purple-800" },
      "Day": { color: "bg-green-100 text-green-800" }
    };

    return (
      <Badge className={typeConfig[shiftType].color}>
        {shiftType}
      </Badge>
    );
  };

  const getCapacityStatus = (assigned: number, max: number) => {
    const percentage = (assigned / max) * 100;
    if (percentage >= 100) return "bg-red-100 text-red-800";
    if (percentage >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-4">
      {/* Week Selection and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Shift Planning</CardTitle>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedWeek, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedWeek}
                    onSelect={(date) => date && setSelectedWeek(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Shift
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Shift</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shiftName">Shift Name</Label>
                      <Input id="shiftName" placeholder="Enter shift name" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input id="startTime" type="time" />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input id="endTime" type="time" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.filter(d => d !== "all").map(dept => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="capacity">Max Capacity</Label>
                      <Input id="capacity" type="number" placeholder="Enter max staff capacity" />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setIsCreateDialogOpen(false)}>
                        Create Shift
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Staff Assigned</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{shift.shiftName}</TableCell>
                    <TableCell>{getShiftTypeBadge(shift.shiftType)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </TableCell>
                    <TableCell>{shift.department}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {shift.staffAssigned.map((staff, index) => (
                          <div key={index} className="text-sm">{staff}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCapacityStatus(shift.staffAssigned.length, shift.maxCapacity)}>
                        {shift.staffAssigned.length}/{shift.maxCapacity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4" />
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

export default ShiftPlannerTab;
