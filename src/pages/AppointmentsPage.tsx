import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, Download, Edit, Upload, Clock, CheckCircle, XCircle, CalendarIcon, Stethoscope, Users, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: number;
  patientName: string;
  age: number;
  gender: string;
  abhaNumber: string;
  abhaAddress: string;
  appointmentDate: string;
  doctor: string;
  phone: string;
  fees: number;
  serviceType: string;
  status: "pending" | "done" | "missed" | "unpaid" | "consult";
}

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // Dummy appointment data matching the reference image
  const [appointments] = useState<Appointment[]>([
    {
      id: 72,
      patientName: "Priya Jain",
      age: 31,
      gender: "Female",
      abhaNumber: "91-3047-8027-7345",
      abhaAddress: "priya17_12.17@sbx",
      appointmentDate: "25 Jul, 2025 05:00 PM",
      doctor: "Dr.kartik",
      phone: "8219339095",
      fees: 100,
      serviceType: "OPD",
      status: "pending"
    },
    {
      id: 71,
      patientName: "Priya Jain",
      age: 31,
      gender: "Female",
      abhaNumber: "91-3047-8027-7345",
      abhaAddress: "priya17_12.17@sbx",
      appointmentDate: "25 Jul, 2025 04:30 PM",
      doctor: "Dr.kartik",
      phone: "8219339095",
      fees: 100,
      serviceType: "OPD",
      status: "pending"
    },
    {
      id: 70,
      patientName: "Priya Jain",
      age: 31,
      gender: "Female",
      abhaNumber: "91-3047-8027-7345",
      abhaAddress: "priya17_12.17@sbx",
      appointmentDate: "25 Jul, 2025 02:00 PM",
      doctor: "Rajeev",
      phone: "7666881821",
      fees: 0,
      serviceType: "OPD",
      status: "unpaid"
    },
    {
      id: 69,
      patientName: "Priya Jain",
      age: 31,
      gender: "Female",
      abhaNumber: "91-7726-7015-5781",
      abhaAddress: "priya17_1712@sbx",
      appointmentDate: "25 Jul, 2025 01:30 PM",
      doctor: "Eqadmin",
      phone: "9175005399",
      fees: 1200,
      serviceType: "OPD",
      status: "consult"
    },
    {
      id: 68,
      patientName: "Aditya Mahajan",
      age: 29,
      gender: "Male",
      abhaNumber: "91-5551-6260-4451",
      abhaAddress: "madit1996@sbx",
      appointmentDate: "25 Jul, 2025 01:00 PM",
      doctor: "Eqadmin",
      phone: "7889846115",
      fees: 1200,
      serviceType: "OPD",
      status: "done"
    },
    {
      id: 67,
      patientName: "Nishant Sharma",
      age: 25,
      gender: "Male",
      abhaNumber: "91-7676-2476-6220",
      abhaAddress: "sharma12000.01@sbx",
      appointmentDate: "24 Jul, 2025 07:00 PM",
      doctor: "Eqadmin",
      phone: "8219339095",
      fees: 1200,
      serviceType: "OPD",
      status: "consult"
    },
    {
      id: 66,
      patientName: "Nishant Sharma",
      age: 25,
      gender: "Male",
      abhaNumber: "91-7676-2476-6220",
      abhaAddress: "sharma12000.01@sbx",
      appointmentDate: "24 Jul, 2025 06:30 PM",
      doctor: "Eqadmin",
      phone: "8219339095",
      fees: 1200,
      serviceType: "OPD",
      status: "consult"
    },
    {
      id: 65,
      patientName: "Priya Jain",
      age: 31,
      gender: "Female",
      abhaNumber: "91-3047-8027-7345",
      abhaAddress: "priya17_12.17@sbx",
      appointmentDate: "24 Jul, 2025 06:15 PM",
      doctor: "Dr.kartik",
      phone: "9175005399",
      fees: 600,
      serviceType: "OPD",
      status: "pending"
    },
    {
      id: 64,
      patientName: "Himanshu Goel",
      age: 26,
      gender: "Male",
      abhaNumber: "91-7836-4615-3776",
      abhaAddress: "himanshugoel1998@sbx",
      appointmentDate: "22 Jul, 2025 04:45 PM",
      doctor: "Dr.kartik",
      phone: "7867654265",
      fees: 600,
      serviceType: "OPD",
      status: "pending"
    },
    {
      id: 63,
      patientName: "Nishant Sharma",
      age: 25,
      gender: "Male",
      abhaNumber: "91-7676-2476-6220",
      abhaAddress: "sharma12000.01@sbx",
      appointmentDate: "22 Jul, 2025 04:30 PM",
      doctor: "Dr.kartik",
      phone: "7867654265",
      fees: 600,
      serviceType: "OPD",
      status: "done"
    },
    {
      id: 62,
      patientName: "Nishant Sharma",
      age: 25,
      gender: "Male",
      abhaNumber: "91-7676-2476-6220",
      abhaAddress: "sharma12000.10@sbx",
      appointmentDate: "22 Jul, 2025 03:45 PM",
      doctor: "Dr.kartik",
      phone: "8219339095",
      fees: 600,
      serviceType: "OPD",
      status: "pending"
    },
    {
      id: 61,
      patientName: "Nishant Sharma",
      age: 25,
      gender: "Male",
      abhaNumber: "91-7676-2476-6220",
      abhaAddress: "sharma1_0101@sbx",
      appointmentDate: "22 Jul, 2025 01:45 PM",
      doctor: "Dr.kartik",
      phone: "8219339095",
      fees: 600,
      serviceType: "OPD",
      status: "pending"
    },
    {
      id: 60,
      patientName: "Nishant Sharma",
      age: 25,
      gender: "Male",
      abhaNumber: "91-7676-2476-6220",
      abhaAddress: "sharma1_0101@sbx",
      appointmentDate: "21 Jul, 2025 04:30 PM",
      doctor: "Dr.kartik",
      phone: "8219339095",
      fees: 600,
      serviceType: "OPD",
      status: "pending"
    },
    {
      id: 59,
      patientName: "Priya Jain",
      age: 31,
      gender: "Female",
      abhaNumber: "91-3047-8027-7345",
      abhaAddress: "priya17_12.17@sbx",
      appointmentDate: "19 Jul, 2025 04:15 PM",
      doctor: "Rajeev",
      phone: "7666881821",
      fees: 1200,
      serviceType: "OPD",
      status: "done"
    },
    {
      id: 58,
      patientName: "Nishant Sharma",
      age: 25,
      gender: "Male",
      abhaNumber: "91-7676-2476-6220",
      abhaAddress: "nishantsharma.2000@sbx",
      appointmentDate: "19 Jul, 2025 01:44 PM",
      doctor: "--",
      phone: "8219339095",
      fees: 0,
      serviceType: "OPD",
      status: "unpaid"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "done":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Done</Badge>;
      case "consult":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Consult</Badge>;
      case "unpaid":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unpaid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getActionButtons = (appointment: Appointment) => {
    return (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" className="h-8 px-2">
          <Edit className="h-3 w-3" />
        </Button>
        {appointment.status === "pending" && (
          <>
            <Button size="sm" className="h-8 px-2 bg-blue-600 hover:bg-blue-700 text-white">
              Consult
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-2">
              <Upload className="h-3 w-3" />
            </Button>
          </>
        )}
        {appointment.status === "done" && (
          <Button size="sm" className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-3 w-3" />
          </Button>
        )}
        {appointment.status === "unpaid" && (
          <Button size="sm" className="h-8 px-2 bg-red-600 hover:bg-red-700 text-white">
            Unpaid
          </Button>
        )}
      </div>
    );
  };

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === "" || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.abhaNumber.includes(searchTerm);
    
    const matchesDoctor = selectedDoctor === "all" || appointment.doctor === selectedDoctor;
    const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus;
    const matchesService = selectedService === "all" || appointment.serviceType === selectedService;

    return matchesSearch && matchesDoctor && matchesStatus && matchesService;
  });

  const uniqueDoctors = Array.from(new Set(appointments.map(a => a.doctor).filter(d => d !== "--"))).sort();
  const uniqueServices = Array.from(new Set(appointments.map(a => a.serviceType))).sort();

  const getAppointmentStats = () => {
    const total = appointments.length;
    const today = appointments.filter(a => a.appointmentDate.includes("25 Jul")).length;
    const pending = appointments.filter(a => a.status === "pending").length;
    const completed = appointments.filter(a => a.status === "done").length;
    
    return { total, today, pending, completed };
  };

  const stats = getAppointmentStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Manage Appointments</h1>
            <p className="text-muted-foreground">Showing 1-{filteredAppointments.length} of {appointments.length}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <CalendarIcon className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {uniqueDoctors.map(doctor => (
                <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="consult">Consult</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {uniqueServices.map(service => (
                <SelectItem key={service} value={service}>{service}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="today">Today ({stats.today})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Appt</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>ABHA Number</TableHead>
                        <TableHead>ABHA Address</TableHead>
                        <TableHead>Appt Date</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Fees</TableHead>
                        <TableHead>Serv</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{appointment.id}</TableCell>
                          <TableCell className="text-primary font-medium">{appointment.patientName}</TableCell>
                          <TableCell>{appointment.age}</TableCell>
                          <TableCell>
                            <Badge variant={appointment.gender === "Male" ? "default" : "secondary"}>
                              {appointment.gender}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{appointment.abhaNumber}</TableCell>
                          <TableCell className="font-mono text-sm">{appointment.abhaAddress}</TableCell>
                          <TableCell>{appointment.appointmentDate}</TableCell>
                          <TableCell className="font-medium">{appointment.doctor}</TableCell>
                          <TableCell>{appointment.phone}</TableCell>
                          <TableCell className="font-semibold">₹{appointment.fees}</TableCell>
                          <TableCell>{appointment.serviceType}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {getActionButtons(appointment)}
                              {getStatusBadge(appointment.status)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredAppointments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {filteredAppointments.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="mr-2">Previous</Button>
                <Button variant="outline">Next</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AppointmentsPage;