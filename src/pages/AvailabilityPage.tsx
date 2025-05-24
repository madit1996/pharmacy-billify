
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Clock, 
  User, 
  Activity, 
  Plus,
  Edit,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DoctorSchedule {
  id: string;
  doctorName: string;
  department: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'available' | 'blocked' | 'leave';
  reason?: string;
}

interface OTSchedule {
  id: string;
  otRoom: string;
  date: Date;
  startTime: string;
  endTime: string;
  surgeon: string;
  procedure: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'blocked';
}

const AvailabilityPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false);
  const [isOTDialogOpen, setIsOTDialogOpen] = useState(false);
  const { toast } = useToast();

  const doctors = [
    "Dr. Andi Wijaya",
    "Dr. Dewi Sutanto", 
    "Dr. Budi Santoso",
    "Dr. Sarah Tanoto"
  ];

  const otRooms = ["OT-1", "OT-2", "OT-3", "OT-4"];

  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([
    {
      id: "DS1",
      doctorName: "Dr. Andi Wijaya",
      department: "Cardiology",
      date: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      status: "available"
    },
    {
      id: "DS2",
      doctorName: "Dr. Dewi Sutanto",
      department: "Pediatrics",
      date: new Date(),
      startTime: "10:00",
      endTime: "16:00",
      status: "blocked",
      reason: "Conference"
    }
  ]);

  const [otSchedules, setOTSchedules] = useState<OTSchedule[]>([
    {
      id: "OT1",
      otRoom: "OT-1",
      date: new Date(),
      startTime: "08:00",
      endTime: "11:00",
      surgeon: "Dr. Budi Santoso",
      procedure: "Knee Replacement",
      status: "scheduled"
    },
    {
      id: "OT2",
      otRoom: "OT-2",
      date: new Date(),
      startTime: "14:00",
      endTime: "16:00",
      surgeon: "Dr. Sarah Tanoto",
      procedure: "Brain Surgery",
      status: "in-progress"
    }
  ]);

  const filteredDoctorSchedules = doctorSchedules.filter(
    schedule => schedule.date.toDateString() === selectedDate.toDateString()
  );

  const filteredOTSchedules = otSchedules.filter(
    schedule => schedule.date.toDateString() === selectedDate.toDateString()
  );

  const handleAddDoctorSchedule = (scheduleData: Partial<DoctorSchedule>) => {
    const newSchedule: DoctorSchedule = {
      id: `DS${doctorSchedules.length + 1}`,
      doctorName: scheduleData.doctorName!,
      department: scheduleData.department!,
      date: selectedDate,
      startTime: scheduleData.startTime!,
      endTime: scheduleData.endTime!,
      status: scheduleData.status as DoctorSchedule['status'],
      reason: scheduleData.reason
    };

    setDoctorSchedules([...doctorSchedules, newSchedule]);
    setIsDoctorDialogOpen(false);
    
    toast({
      title: "Schedule Updated",
      description: `Schedule for ${scheduleData.doctorName} has been updated`,
    });
  };

  const handleAddOTSchedule = (scheduleData: Partial<OTSchedule>) => {
    const newSchedule: OTSchedule = {
      id: `OT${otSchedules.length + 1}`,
      otRoom: scheduleData.otRoom!,
      date: selectedDate,
      startTime: scheduleData.startTime!,
      endTime: scheduleData.endTime!,
      surgeon: scheduleData.surgeon!,
      procedure: scheduleData.procedure!,
      status: scheduleData.status as OTSchedule['status']
    };

    setOTSchedules([...otSchedules, newSchedule]);
    setIsOTDialogOpen(false);
    
    toast({
      title: "OT Schedule Updated",
      description: `${scheduleData.otRoom} scheduled for ${scheduleData.procedure}`,
    });
  };

  const getDoctorStatusBadge = (status: DoctorSchedule['status']) => {
    const statusConfig = {
      available: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      blocked: { color: "bg-red-100 text-red-800", icon: X },
      leave: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getOTStatusBadge = (status: OTSchedule['status']) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", icon: Clock },
      "in-progress": { color: "bg-orange-100 text-orange-800", icon: Activity },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      blocked: { color: "bg-red-100 text-red-800", icon: X }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Availability Management</h1>
        <div className="flex gap-2">
          <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Doctor Schedule</DialogTitle>
              </DialogHeader>
              <DoctorScheduleForm onSubmit={handleAddDoctorSchedule} doctors={doctors} />
            </DialogContent>
          </Dialog>

          <Dialog open={isOTDialogOpen} onOpenChange={setIsOTDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule OT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule Operating Theater</DialogTitle>
              </DialogHeader>
              <OTScheduleForm 
                onSubmit={handleAddOTSchedule} 
                otRooms={otRooms}
                doctors={doctors}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Schedules */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Schedules for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="doctors" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="doctors">Doctor Availability</TabsTrigger>
                <TabsTrigger value="ot">Operating Theater</TabsTrigger>
              </TabsList>
              
              <TabsContent value="doctors">
                <div className="space-y-4">
                  <h3 className="font-medium">Doctor Schedules ({filteredDoctorSchedules.length})</h3>
                  {filteredDoctorSchedules.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No doctor schedules for this date</p>
                    </div>
                  ) : (
                    filteredDoctorSchedules.map(schedule => (
                      <Card key={schedule.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{schedule.doctorName}</h4>
                                {getDoctorStatusBadge(schedule.status)}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="font-medium">Department:</span> {schedule.department}</p>
                                <p><span className="font-medium">Time:</span> {schedule.startTime} - {schedule.endTime}</p>
                                {schedule.reason && (
                                  <p><span className="font-medium">Reason:</span> {schedule.reason}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="ot">
                <div className="space-y-4">
                  <h3 className="font-medium">OT Schedules ({filteredOTSchedules.length})</h3>
                  {filteredOTSchedules.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No OT schedules for this date</p>
                    </div>
                  ) : (
                    filteredOTSchedules.map(schedule => (
                      <Card key={schedule.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{schedule.otRoom}</h4>
                                {getOTStatusBadge(schedule.status)}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="font-medium">Surgeon:</span> {schedule.surgeon}</p>
                                <p><span className="font-medium">Procedure:</span> {schedule.procedure}</p>
                                <p><span className="font-medium">Time:</span> {schedule.startTime} - {schedule.endTime}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DoctorScheduleForm = ({ onSubmit, doctors }: { onSubmit: (data: Partial<DoctorSchedule>) => void, doctors: string[] }) => {
  const [formData, setFormData] = useState({
    doctorName: '',
    department: '',
    startTime: '',
    endTime: '',
    status: 'available' as DoctorSchedule['status'],
    reason: ''
  });

  const departmentMap: { [key: string]: string } = {
    "Dr. Andi Wijaya": "Cardiology",
    "Dr. Dewi Sutanto": "Pediatrics",
    "Dr. Budi Santoso": "Orthopedics",
    "Dr. Sarah Tanoto": "Neurology"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Doctor</Label>
        <Select 
          value={formData.doctorName}
          onValueChange={(value) => setFormData({
            ...formData, 
            doctorName: value,
            department: departmentMap[value] || ''
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map(doctor => (
              <SelectItem key={doctor} value={doctor}>
                {doctor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Time</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>End Time</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label>Status</Label>
        <Select 
          value={formData.status}
          onValueChange={(value) => setFormData({...formData, status: value as DoctorSchedule['status']})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.status === 'blocked' || formData.status === 'leave') && (
        <div>
          <Label>Reason</Label>
          <Input
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            placeholder="Reason for blocking/leave"
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Add Schedule
      </Button>
    </form>
  );
};

const OTScheduleForm = ({ onSubmit, otRooms, doctors }: { 
  onSubmit: (data: Partial<OTSchedule>) => void, 
  otRooms: string[],
  doctors: string[]
}) => {
  const [formData, setFormData] = useState({
    otRoom: '',
    startTime: '',
    endTime: '',
    surgeon: '',
    procedure: '',
    status: 'scheduled' as OTSchedule['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Operating Theater</Label>
        <Select 
          value={formData.otRoom}
          onValueChange={(value) => setFormData({...formData, otRoom: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select OT Room" />
          </SelectTrigger>
          <SelectContent>
            {otRooms.map(room => (
              <SelectItem key={room} value={room}>
                {room}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Surgeon</Label>
        <Select 
          value={formData.surgeon}
          onValueChange={(value) => setFormData({...formData, surgeon: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Surgeon" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map(doctor => (
              <SelectItem key={doctor} value={doctor}>
                {doctor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Procedure</Label>
        <Input
          value={formData.procedure}
          onChange={(e) => setFormData({...formData, procedure: e.target.value})}
          placeholder="Surgery procedure"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Time</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>End Time</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Schedule OT
      </Button>
    </form>
  );
};

export default AvailabilityPage;
