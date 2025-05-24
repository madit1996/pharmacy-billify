
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  Edit,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  notes?: string;
}

interface Doctor {
  id: string;
  name: string;
  department: string;
  availability: string[];
}

const AppointmentsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  const doctors: Doctor[] = [
    { id: "D1", name: "Dr. Andi Wijaya", department: "Cardiology", availability: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
    { id: "D2", name: "Dr. Dewi Sutanto", department: "Pediatrics", availability: ["09:30", "10:30", "11:30", "14:30", "15:30"] },
    { id: "D3", name: "Dr. Budi Santoso", department: "Orthopedics", availability: ["10:00", "11:00", "14:00", "15:00", "16:00"] },
    { id: "D4", name: "Dr. Sarah Tanoto", department: "Neurology", availability: ["09:00", "10:00", "14:00", "15:00"] }
  ];

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "A1",
      patientName: "John Doe",
      patientPhone: "+1-555-123-4567",
      doctorName: "Dr. Andi Wijaya",
      department: "Cardiology",
      date: new Date(),
      time: "09:00",
      status: "scheduled",
      notes: "Regular checkup"
    },
    {
      id: "A2",
      patientName: "Jane Smith",
      patientPhone: "+1-555-987-6543",
      doctorName: "Dr. Dewi Sutanto",
      department: "Pediatrics",
      date: new Date(),
      time: "10:30",
      status: "completed"
    }
  ]);

  const filteredAppointments = appointments.filter(apt => {
    const dateMatch = apt.date.toDateString() === selectedDate.toDateString();
    const doctorMatch = !selectedDoctor || apt.doctorName === selectedDoctor;
    return dateMatch && doctorMatch;
  });

  const handleBookAppointment = (appointmentData: Partial<Appointment>) => {
    const newAppointment: Appointment = {
      id: `A${appointments.length + 1}`,
      patientName: appointmentData.patientName!,
      patientPhone: appointmentData.patientPhone!,
      doctorName: appointmentData.doctorName!,
      department: appointmentData.department!,
      date: selectedDate,
      time: appointmentData.time!,
      status: 'scheduled',
      notes: appointmentData.notes
    };

    setAppointments([...appointments, newAppointment]);
    setIsBookingDialogOpen(false);
    
    toast({
      title: "Appointment Booked",
      description: `Appointment scheduled for ${appointmentData.patientName} with ${appointmentData.doctorName}`,
    });
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
    
    toast({
      title: "Appointment Updated",
      description: `Appointment status changed to ${status}`,
    });
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      missed: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: X }
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
        <h1 className="text-2xl font-bold">Appointments Management</h1>
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <AppointmentForm 
              onSubmit={handleBookAppointment}
              doctors={doctors}
              selectedDate={selectedDate}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar and Filters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            
            <div className="mt-4 space-y-3">
              <div>
                <Label>Filter by Doctor</Label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Doctors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Doctors</SelectItem>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.name}>
                        {doctor.name} - {doctor.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Appointments for {selectedDate.toLocaleDateString()}
            </CardTitle>
            <CardDescription>
              {filteredAppointments.length} appointments scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="missed">Missed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <AppointmentsList 
                  appointments={filteredAppointments}
                  onUpdateStatus={updateAppointmentStatus}
                />
              </TabsContent>
              
              <TabsContent value="scheduled">
                <AppointmentsList 
                  appointments={filteredAppointments.filter(a => a.status === 'scheduled')}
                  onUpdateStatus={updateAppointmentStatus}
                />
              </TabsContent>
              
              <TabsContent value="completed">
                <AppointmentsList 
                  appointments={filteredAppointments.filter(a => a.status === 'completed')}
                  onUpdateStatus={updateAppointmentStatus}
                />
              </TabsContent>
              
              <TabsContent value="missed">
                <AppointmentsList 
                  appointments={filteredAppointments.filter(a => a.status === 'missed')}
                  onUpdateStatus={updateAppointmentStatus}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface AppointmentFormProps {
  onSubmit: (data: Partial<Appointment>) => void;
  doctors: Doctor[];
  selectedDate: Date;
}

const AppointmentForm = ({ onSubmit, doctors, selectedDate }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorName: '',
    department: '',
    time: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedDoctor = doctors.find(d => d.name === formData.doctorName);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Patient Name</Label>
          <Input
            value={formData.patientName}
            onChange={(e) => setFormData({...formData, patientName: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Patient Phone</Label>
          <Input
            value={formData.patientPhone}
            onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label>Doctor</Label>
        <Select 
          value={formData.doctorName} 
          onValueChange={(value) => {
            const doctor = doctors.find(d => d.name === value);
            setFormData({
              ...formData, 
              doctorName: value,
              department: doctor?.department || ''
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map(doctor => (
              <SelectItem key={doctor.id} value={doctor.name}>
                {doctor.name} - {doctor.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDoctor && (
        <div>
          <Label>Available Time Slots</Label>
          <Select 
            value={formData.time} 
            onValueChange={(value) => setFormData({...formData, time: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent>
              {selectedDoctor.availability.map(time => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Notes (Optional)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Any additional notes..."
        />
      </div>

      <Button type="submit" className="w-full">
        Book Appointment
      </Button>
    </form>
  );
};

interface AppointmentsListProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
}

const AppointmentsList = ({ appointments, onUpdateStatus }: AppointmentsListProps) => {
  const getStatusBadge = (status: Appointment['status']) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      missed: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: X }
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

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No appointments</h3>
        <p className="text-gray-500">No appointments scheduled for this date</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map(appointment => (
        <Card key={appointment.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium">{appointment.patientName}</h4>
                  {getStatusBadge(appointment.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {appointment.doctorName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {appointment.patientPhone}
                  </div>
                  <div>
                    <span className="font-medium">{appointment.department}</span>
                  </div>
                </div>
                
                {appointment.notes && (
                  <p className="mt-2 text-sm text-gray-600">{appointment.notes}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                {appointment.status === 'scheduled' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onUpdateStatus(appointment.id, 'completed')}
                    >
                      Complete
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onUpdateStatus(appointment.id, 'missed')}
                    >
                      Mark Missed
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentsPage;
