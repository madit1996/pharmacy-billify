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
import { Search, Filter, Download, Edit, Eye, Plus, CalendarIcon, Users, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  gender: string;
  abhaNumber: string;
  abhaAddress: string;
  abhaAddressLastUsed: string;
  registrationDate: string;
}

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Dummy patient data matching the reference image
  const [patients] = useState<Patient[]>([
    {
      id: "PAT-26",
      name: "Priya Jain",
      email: "priya.jain@example.com",
      phone: "9175005399",
      city: "RAISEN",
      age: 31,
      gender: "Female",
      abhaNumber: "91-7617-3603-1458",
      abhaAddress: "priya123123@sbx",
      abhaAddressLastUsed: "priya123123@sbx",
      registrationDate: "28-Jul-2025"
    },
    {
      id: "PAT-25",
      name: "Priya Jain",
      email: "priya.alt@example.com",
      phone: "9175005399",
      city: "RAISEN",
      age: 31,
      gender: "Female",
      abhaNumber: "91-2278-8646-1374",
      abhaAddress: "priya_1311@sbx",
      abhaAddressLastUsed: "priya_1311@sbx",
      registrationDate: "24-Jul-2025"
    },
    {
      id: "PAT-24",
      name: "Himanshu Goel",
      email: "himanshu.goel@example.com",
      phone: "7867654265",
      city: "FARIDABAD",
      age: 26,
      gender: "Male",
      abhaNumber: "91-7836-4615-3776",
      abhaAddress: "himanshugoel1998@sbx",
      abhaAddressLastUsed: "himanshugoel1998@sbx",
      registrationDate: "22-Jul-2025"
    },
    {
      id: "PAT-23",
      name: "Sandeep Kumar",
      email: "sandeep.kumar@example.com",
      phone: "8219339095",
      city: "MANDI",
      age: 35,
      gender: "Male",
      abhaNumber: "91-2817-1004-7065",
      abhaAddress: "sandeep_s.89@sbx",
      abhaAddressLastUsed: "sandeep_s.89@sbx",
      registrationDate: "18-Jul-2025"
    },
    {
      id: "PAT-22",
      name: "Sejal Sabannawar",
      email: "sejal.s@example.com",
      phone: "7666881821",
      city: "SANGLI",
      age: 23,
      gender: "Female",
      abhaNumber: "91-1115-4600-8306",
      abhaAddress: "sejal_0509@sbx",
      abhaAddressLastUsed: "sejal_0509@sbx",
      registrationDate: "17-Jul-2025"
    },
    {
      id: "PAT-21",
      name: "Vireshwar Kachhava",
      email: "vireshwar.k@example.com",
      phone: "9175005399",
      city: "AMRAVATI",
      age: 22,
      gender: "Male",
      abhaNumber: "91-2760-3314-7287",
      abhaAddress: "vireshwar_18182002@sbx",
      abhaAddressLastUsed: "vireshwar_18182002@sbx",
      registrationDate: "17-Jul-2025"
    },
    {
      id: "PAT-18",
      name: "Priya Jain",
      email: "priya.third@example.com",
      phone: "7666881821",
      city: "RAISEN",
      age: 31,
      gender: "Female",
      abhaNumber: "91-3047-8027-7345",
      abhaAddress: "priya17_12.17@sbx",
      abhaAddressLastUsed: "priya17_12.17@sbx",
      registrationDate: "17-Jul-2025"
    },
    {
      id: "PAT-17",
      name: "Aditya Mahajan",
      email: "aditya.mahajan@example.com",
      phone: "7889846115",
      city: "GURDDASPUR",
      age: 29,
      gender: "Male",
      abhaNumber: "91-5551-6260-4451",
      abhaAddress: "madit1996@sbx",
      abhaAddressLastUsed: "madit1996@sbx",
      registrationDate: "17-Jul-2025"
    },
    {
      id: "PAT-14",
      name: "Priya Jain",
      email: "priya.fourth@example.com",
      phone: "9175005399",
      city: "RAISEN",
      age: 31,
      gender: "Female",
      abhaNumber: "91-7726-7015-5781",
      abhaAddress: "priya17_1712@sbx",
      abhaAddressLastUsed: "priya17_1712@sbx",
      registrationDate: "16-Jul-2025"
    },
    {
      id: "PAT-11",
      name: "Nishant Sharma",
      email: "nishant.sharma@example.com",
      phone: "8219339095",
      city: "HAMIRPUR",
      age: 25,
      gender: "Male",
      abhaNumber: "91-7676-2476-6220",
      abhaAddress: "sharma12000.01@sbx",
      abhaAddressLastUsed: "sharma12000.01@sbx",
      registrationDate: "16-Jul-2025"
    }
  ]);

  const handleEditPatient = (patient: Patient) => {
    navigate(`/patients/${patient.id}/edit`);
  };

  // Filter patients based on search and filters
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === "" || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.abhaNumber.includes(searchTerm) ||
      patient.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = selectedGender === "all" || patient.gender === selectedGender;
    const matchesCity = selectedCity === "all" || patient.city === selectedCity;
    const matchesAgeRange = selectedAgeRange === "all" || 
      (selectedAgeRange === "18-30" && patient.age >= 18 && patient.age <= 30) ||
      (selectedAgeRange === "31-50" && patient.age >= 31 && patient.age <= 50) ||
      (selectedAgeRange === "50+" && patient.age > 50);

    return matchesSearch && matchesGender && matchesCity && matchesAgeRange;
  });

  const uniqueCities = Array.from(new Set(patients.map(p => p.city))).sort();

  const getPatientStats = () => {
    const total = patients.length;
    const pharmacy = Math.floor(total * 0.3);
    const lab = Math.floor(total * 0.25);
    const recent = Math.floor(total * 0.4);
    
    return { total, pharmacy, lab, recent };
  };

  const stats = getPatientStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Manage Patients</h1>
            <p className="text-muted-foreground">Showing 1-{filteredPatients.length} of {patients.length}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Select value={selectedGender} onValueChange={setSelectedGender}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {uniqueCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAgeRange} onValueChange={setSelectedAgeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Age Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="18-30">18-30 years</SelectItem>
              <SelectItem value="31-50">31-50 years</SelectItem>
              <SelectItem value="50+">50+ years</SelectItem>
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
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy ({stats.pharmacy})</TabsTrigger>
            <TabsTrigger value="lab">Lab ({stats.lab})</TabsTrigger>
            <TabsTrigger value="recent">Recent ({stats.recent})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>ABHA Number</TableHead>
                        <TableHead>ABHA Address</TableHead>
                        <TableHead>ABHA Address (Last Used)</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{patient.id}</TableCell>
                          <TableCell className="text-primary font-medium">{patient.name}</TableCell>
                          <TableCell className="text-muted-foreground">{patient.email}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                          <TableCell>{patient.city}</TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>
                            <Badge variant={patient.gender === "Male" ? "default" : "secondary"}>
                              {patient.gender}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{patient.abhaNumber}</TableCell>
                          <TableCell className="font-mono text-sm">{patient.abhaAddress}</TableCell>
                          <TableCell className="font-mono text-sm">{patient.abhaAddressLastUsed}</TableCell>
                          <TableCell>{patient.registrationDate}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => handleEditPatient(patient)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredPatients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No patients found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {filteredPatients.length > 0 && (
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

export default PatientsPage;