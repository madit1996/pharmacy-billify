
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Users, Edit, Eye, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  address: string;
  email?: string;
  lastVisit?: Date;
  bloodGroup?: string;
  emergencyContact?: string;
  medicalHistory?: string[];
}

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      mobile: "+1-555-123-4567",
      address: "123 Main St, Anytown",
      email: "john.doe@example.com",
      lastVisit: new Date(2023, 7, 15),
      bloodGroup: "O+",
      emergencyContact: "+1-555-123-9999",
      medicalHistory: ["Hypertension", "Diabetes"]
    },
    {
      id: "P002",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      mobile: "+1-555-987-6543",
      address: "456 Oak Ave, Somewhere",
      email: "jane.smith@example.com",
      lastVisit: new Date(2023, 7, 16),
      bloodGroup: "A+",
      emergencyContact: "+1-555-987-0000",
      medicalHistory: ["Allergies"]
    },
    {
      id: "P003",
      name: "Michael Brown",
      age: 58,
      gender: "Male",
      mobile: "+1-555-456-7890",
      address: "789 Pine Rd, Nowhere",
      lastVisit: new Date(2023, 7, 17),
      bloodGroup: "B+",
      emergencyContact: "+1-555-456-0000",
      medicalHistory: ["Arthritis", "High Cholesterol"]
    },
    {
      id: "P004",
      name: "Emily Davis",
      age: 27,
      gender: "Female",
      mobile: "+1-555-789-0123",
      address: "101 Maple Dr, Anywhere",
      email: "emily.davis@example.com",
      lastVisit: new Date(2023, 7, 12),
      bloodGroup: "AB+",
      emergencyContact: "+1-555-789-0000"
    },
    {
      id: "C1",
      name: "Yuda Rahmat",
      age: 35,
      gender: "Male",
      mobile: "+62-812-3456-7890",
      address: "123 Jakarta Street, Indonesia",
      bloodGroup: "O+",
      emergencyContact: "+62-812-0000-0000"
    },
    {
      id: "C2",
      name: "Aulia Akbar",
      age: 42,
      gender: "Female",
      mobile: "+62-813-5678-9012",
      address: "456 Bandung Road, Indonesia",
      bloodGroup: "A+",
      emergencyContact: "+62-813-0000-0000"
    },
    {
      id: "C3",
      name: "Sarah Johnson",
      age: 29,
      gender: "Female",
      mobile: "+1-555-987-6543",
      address: "456 Oak Ave, Somewhere",
      bloodGroup: "B+",
      emergencyContact: "+1-555-987-0000"
    }
  ]);

  const filteredPatients = searchTerm
    ? patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mobile.includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : patients;

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setIsEditDialogOpen(false);
    toast({
      title: "Patient Updated",
      description: "Patient information has been updated successfully",
    });
  };

  const handleAddPatient = (newPatient: Omit<Patient, 'id'>) => {
    const patient: Patient = {
      id: `P${patients.length + 1}`,
      ...newPatient
    };
    setPatients([...patients, patient]);
    toast({
      title: "Patient Added",
      description: "New patient has been added successfully",
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Patients Overview</CardTitle>
            <CardDescription>
              Manage all patients with advanced search and profile management
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-80">
              <Input
                placeholder="Search by name, phone, email, or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                </DialogHeader>
                <PatientForm onSubmit={handleAddPatient} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">All Patients ({filteredPatients.length})</TabsTrigger>
              <TabsTrigger value="pharmacy">Pharmacy ({filteredPatients.filter(p => p.id.startsWith("C")).length})</TabsTrigger>
              <TabsTrigger value="lab">Lab ({filteredPatients.filter(p => p.id.startsWith("P")).length})</TabsTrigger>
              <TabsTrigger value="recent">Recent Visits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <PatientTable 
                patients={filteredPatients} 
                onViewPatient={handleViewPatient}
                onEditPatient={handleEditPatient}
              />
            </TabsContent>
            
            <TabsContent value="pharmacy">
              <PatientTable 
                patients={filteredPatients.filter(p => p.id.startsWith("C"))} 
                onViewPatient={handleViewPatient}
                onEditPatient={handleEditPatient}
              />
            </TabsContent>
            
            <TabsContent value="lab">
              <PatientTable 
                patients={filteredPatients.filter(p => p.id.startsWith("P"))} 
                onViewPatient={handleViewPatient}
                onEditPatient={handleEditPatient}
              />
            </TabsContent>
            
            <TabsContent value="recent">
              <PatientTable 
                patients={filteredPatients
                  .filter(p => p.lastVisit)
                  .sort((a, b) => 
                    (b.lastVisit?.getTime() || 0) - (a.lastVisit?.getTime() || 0)
                  )
                } 
                onViewPatient={handleViewPatient}
                onEditPatient={handleEditPatient}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
          </DialogHeader>
          {selectedPatient && <PatientProfile patient={selectedPatient} />}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <PatientForm 
              patient={selectedPatient} 
              onSubmit={handleUpdatePatient} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PatientTableProps {
  patients: Patient[];
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
}

const PatientTable = ({ patients, onViewPatient, onEditPatient }: PatientTableProps) => {
  if (patients.length === 0) {
    return (
      <div className="text-center py-10">
        <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No patients found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient Info
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medical Info
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Visit
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map(patient => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{patient.name}</span>
                    <Badge variant="outline" className="text-xs">ID: {patient.id}</Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {patient.age} years • {patient.gender}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {patient.mobile}
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      {patient.email}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-xs">{patient.address}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  {patient.bloodGroup && (
                    <Badge className="bg-red-100 text-red-800">
                      {patient.bloodGroup}
                    </Badge>
                  )}
                  {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                    <div className="text-xs text-gray-600">
                      {patient.medicalHistory.slice(0, 2).join(", ")}
                      {patient.medicalHistory.length > 2 && "..."}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-500">
                {patient.lastVisit 
                  ? patient.lastVisit.toLocaleDateString() 
                  : 'No visit recorded'}
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewPatient(patient)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEditPatient(patient)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PatientProfile = ({ patient }: { patient: Patient }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-500">Patient ID</Label>
          <p className="mt-1">{patient.id}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Name</Label>
          <p className="mt-1 font-medium">{patient.name}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Age</Label>
          <p className="mt-1">{patient.age} years</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Gender</Label>
          <p className="mt-1">{patient.gender}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Blood Group</Label>
          <p className="mt-1">{patient.bloodGroup || 'Not specified'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Last Visit</Label>
          <p className="mt-1">{patient.lastVisit ? patient.lastVisit.toLocaleDateString() : 'No visit recorded'}</p>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-500">Contact Information</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{patient.mobile}</span>
          </div>
          {patient.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{patient.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{patient.address}</span>
          </div>
          {patient.emergencyContact && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-red-400" />
              <span>Emergency: {patient.emergencyContact}</span>
            </div>
          )}
        </div>
      </div>

      {patient.medicalHistory && patient.medicalHistory.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-gray-500">Medical History</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {patient.medicalHistory.map((condition, index) => (
              <Badge key={index} variant="outline">
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PatientForm = ({ patient, onSubmit }: { 
  patient?: Patient, 
  onSubmit: (data: any) => void 
}) => {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    age: patient?.age || '',
    gender: patient?.gender || 'Male',
    mobile: patient?.mobile || '',
    email: patient?.email || '',
    address: patient?.address || '',
    bloodGroup: patient?.bloodGroup || '',
    emergencyContact: patient?.emergencyContact || '',
    medicalHistory: patient?.medicalHistory?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      age: Number(formData.age),
      medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(s => s.trim()) : [],
      id: patient?.id
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Age</Label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Gender</Label>
          <Select 
            value={formData.gender}
            onValueChange={(value) => setFormData({...formData, gender: value as Patient['gender']})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Blood Group</Label>
          <Select 
            value={formData.bloodGroup}
            onValueChange={(value) => setFormData({...formData, bloodGroup: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Mobile</Label>
          <Input
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required
        />
      </div>

      <div>
        <Label>Emergency Contact</Label>
        <Input
          value={formData.emergencyContact}
          onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
        />
      </div>

      <div>
        <Label>Medical History (comma-separated)</Label>
        <Input
          value={formData.medicalHistory}
          onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
          placeholder="e.g., Diabetes, Hypertension, Allergies"
        />
      </div>

      <Button type="submit" className="w-full">
        {patient ? 'Update Patient' : 'Add Patient'}
      </Button>
    </form>
  );
};

export default PatientsPage;
