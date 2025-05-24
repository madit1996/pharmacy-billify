
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  BedDouble, 
  Users, 
  Plus,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  MapPin,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IPDPatient {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  wardName: string;
  roomNumber: string;
  bedNumber: string;
  admissionDate: Date;
  expectedDischarge?: Date;
  attendingDoctor: string;
  condition: string;
  status: 'admitted' | 'discharge-pending' | 'discharged';
  contactNumber: string;
  emergencyContact: string;
  diagnosis: string;
  admissionReason: string;
}

interface Ward {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  type: 'general' | 'private' | 'semi-private' | 'ICU';
}

const IPDPage = () => {
  const [isAdmissionDialogOpen, setIsAdmissionDialogOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState<string>("");
  const { toast } = useToast();

  const wards: Ward[] = [
    { id: "W1", name: "General Ward A", totalBeds: 30, occupiedBeds: 24, availableBeds: 6, type: "general" },
    { id: "W2", name: "General Ward B", totalBeds: 30, occupiedBeds: 28, availableBeds: 2, type: "general" },
    { id: "W3", name: "Private Ward", totalBeds: 20, occupiedBeds: 15, availableBeds: 5, type: "private" },
    { id: "W4", name: "Semi-Private Ward", totalBeds: 25, occupiedBeds: 20, availableBeds: 5, type: "semi-private" },
    { id: "W5", name: "Pediatric Ward", totalBeds: 15, occupiedBeds: 12, availableBeds: 3, type: "general" }
  ];

  const [ipdPatients, setIpdPatients] = useState<IPDPatient[]>([
    {
      id: "IPD001",
      patientName: "John Smith",
      patientId: "P001",
      age: 45,
      gender: "Male",
      wardName: "General Ward A",
      roomNumber: "101",
      bedNumber: "B1",
      admissionDate: new Date(2024, 0, 15),
      expectedDischarge: new Date(2024, 0, 20),
      attendingDoctor: "Dr. Andi Wijaya",
      condition: "Stable",
      status: "admitted",
      contactNumber: "+1-555-123-4567",
      emergencyContact: "+1-555-123-9999",
      diagnosis: "Pneumonia",
      admissionReason: "Respiratory distress"
    },
    {
      id: "IPD002",
      patientName: "Mary Johnson",
      patientId: "P002",
      age: 32,
      gender: "Female",
      wardName: "Private Ward",
      roomNumber: "201",
      bedNumber: "B1",
      admissionDate: new Date(2024, 0, 10),
      expectedDischarge: new Date(2024, 0, 18),
      attendingDoctor: "Dr. Dewi Sutanto",
      condition: "Recovering",
      status: "discharge-pending",
      contactNumber: "+1-555-987-6543",
      emergencyContact: "+1-555-987-0000",
      diagnosis: "Post-operative care",
      admissionReason: "Appendectomy"
    },
    {
      id: "IPD003",
      patientName: "Robert Wilson",
      patientId: "P003",
      age: 67,
      gender: "Male",
      wardName: "General Ward B",
      roomNumber: "105",
      bedNumber: "B3",
      admissionDate: new Date(2024, 0, 12),
      expectedDischarge: new Date(2024, 0, 16),
      attendingDoctor: "Dr. Budi Santoso",
      condition: "Critical",
      status: "discharge-pending",
      contactNumber: "+1-555-456-7890",
      emergencyContact: "+1-555-456-0000",
      diagnosis: "Cardiac arrest",
      admissionReason: "Emergency admission"
    }
  ]);

  const filteredPatients = selectedWard 
    ? ipdPatients.filter(patient => patient.wardName === selectedWard)
    : ipdPatients;

  const dischargePendingPatients = ipdPatients.filter(p => {
    if (p.status === 'discharge-pending') return true;
    if (p.expectedDischarge) {
      const daysDiff = Math.ceil((new Date().getTime() - p.expectedDischarge.getTime()) / (1000 * 3600 * 24));
      return daysDiff > 1; // More than 24 hours past expected discharge
    }
    return false;
  });

  const handleAdmitPatient = (patientData: Partial<IPDPatient>) => {
    const newPatient: IPDPatient = {
      id: `IPD${String(ipdPatients.length + 1).padStart(3, '0')}`,
      patientName: patientData.patientName!,
      patientId: patientData.patientId!,
      age: patientData.age!,
      gender: patientData.gender!,
      wardName: patientData.wardName!,
      roomNumber: patientData.roomNumber!,
      bedNumber: patientData.bedNumber!,
      admissionDate: new Date(),
      expectedDischarge: patientData.expectedDischarge,
      attendingDoctor: patientData.attendingDoctor!,
      condition: patientData.condition!,
      status: 'admitted',
      contactNumber: patientData.contactNumber!,
      emergencyContact: patientData.emergencyContact!,
      diagnosis: patientData.diagnosis!,
      admissionReason: patientData.admissionReason!
    };

    setIpdPatients([...ipdPatients, newPatient]);
    setIsAdmissionDialogOpen(false);
    
    toast({
      title: "Patient Admitted",
      description: `${patientData.patientName} has been admitted to ${patientData.wardName}`,
    });
  };

  const handleDischarge = (patientId: string) => {
    setIpdPatients(ipdPatients.map(p => 
      p.id === patientId ? { ...p, status: 'discharged' as const } : p
    ));
    
    toast({
      title: "Patient Discharged",
      description: "Patient has been successfully discharged",
    });
  };

  const getConditionBadge = (condition: string) => {
    const conditionConfig: { [key: string]: string } = {
      'Stable': 'bg-green-100 text-green-800',
      'Critical': 'bg-red-100 text-red-800',
      'Recovering': 'bg-blue-100 text-blue-800',
      'Serious': 'bg-orange-100 text-orange-800'
    };

    return (
      <Badge className={conditionConfig[condition] || 'bg-gray-100 text-gray-800'}>
        {condition}
      </Badge>
    );
  };

  const getStatusBadge = (status: IPDPatient['status']) => {
    const statusConfig = {
      'admitted': 'bg-blue-100 text-blue-800',
      'discharge-pending': 'bg-yellow-100 text-yellow-800',
      'discharged': 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={statusConfig[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">In-Patient Department (IPD)</h1>
        <Dialog open={isAdmissionDialogOpen} onOpenChange={setIsAdmissionDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Admit Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Admit New Patient</DialogTitle>
            </DialogHeader>
            <AdmissionForm onSubmit={handleAdmitPatient} wards={wards} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {dischargePendingPatients.length > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Discharge Alerts ({dischargePendingPatients.length})
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Patients with pending discharge or overdue expected discharge dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dischargePendingPatients.map(patient => (
                <div key={patient.id} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <span className="font-medium">{patient.patientName}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {patient.wardName} - {patient.roomNumber}/{patient.bedNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-yellow-700">
                      Expected: {patient.expectedDischarge?.toLocaleDateString()}
                    </span>
                    <Button size="sm" onClick={() => handleDischarge(patient.id)}>
                      Discharge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ward Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Ward Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Filter by Ward</Label>
                <Select value={selectedWard} onValueChange={setSelectedWard}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Wards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Wards</SelectItem>
                    {wards.map(ward => (
                      <SelectItem key={ward.id} value={ward.name}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {wards.map(ward => (
                  <div key={ward.id} className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">{ward.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {ward.type}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium">{ward.totalBeds}</div>
                        <div className="text-gray-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">{ward.occupiedBeds}</div>
                        <div className="text-gray-500">Occupied</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{ward.availableBeds}</div>
                        <div className="text-gray-500">Available</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Admitted Patients ({filteredPatients.length})
            </CardTitle>
            <CardDescription>
              Current in-patient admissions and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Patients</TabsTrigger>
                <TabsTrigger value="admitted">Admitted</TabsTrigger>
                <TabsTrigger value="discharge-pending">Discharge Pending</TabsTrigger>
                <TabsTrigger value="discharged">Discharged</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <PatientList 
                  patients={filteredPatients}
                  onDischarge={handleDischarge}
                />
              </TabsContent>
              
              <TabsContent value="admitted">
                <PatientList 
                  patients={filteredPatients.filter(p => p.status === 'admitted')}
                  onDischarge={handleDischarge}
                />
              </TabsContent>
              
              <TabsContent value="discharge-pending">
                <PatientList 
                  patients={filteredPatients.filter(p => p.status === 'discharge-pending')}
                  onDischarge={handleDischarge}
                />
              </TabsContent>
              
              <TabsContent value="discharged">
                <PatientList 
                  patients={filteredPatients.filter(p => p.status === 'discharged')}
                  onDischarge={handleDischarge}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PatientList = ({ patients, onDischarge }: { 
  patients: IPDPatient[], 
  onDischarge: (patientId: string) => void 
}) => {
  const getConditionBadge = (condition: string) => {
    const conditionConfig: { [key: string]: string } = {
      'Stable': 'bg-green-100 text-green-800',
      'Critical': 'bg-red-100 text-red-800',
      'Recovering': 'bg-blue-100 text-blue-800',
      'Serious': 'bg-orange-100 text-orange-800'
    };

    return (
      <Badge className={conditionConfig[condition] || 'bg-gray-100 text-gray-800'}>
        {condition}
      </Badge>
    );
  };

  const getStatusBadge = (status: IPDPatient['status']) => {
    const statusConfig = {
      'admitted': 'bg-blue-100 text-blue-800',
      'discharge-pending': 'bg-yellow-100 text-yellow-800',
      'discharged': 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={statusConfig[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No patients found</h3>
        <p className="text-gray-500">No patients match the current filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patients.map(patient => (
        <Card key={patient.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-medium">{patient.patientName}</h4>
                  <Badge variant="outline">ID: {patient.patientId}</Badge>
                  {getStatusBadge(patient.status)}
                  {getConditionBadge(patient.condition)}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Ward/Room:</span>
                    <p className="font-medium">{patient.wardName}</p>
                    <p className="text-gray-600">{patient.roomNumber}/{patient.bedNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Doctor:</span>
                    <p className="font-medium">{patient.attendingDoctor}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Admission:</span>
                    <p className="font-medium">{patient.admissionDate.toLocaleDateString()}</p>
                    {patient.expectedDischarge && (
                      <p className="text-gray-600">
                        Expected: {patient.expectedDischarge.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">Diagnosis:</span>
                    <p className="font-medium">{patient.diagnosis}</p>
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <span className="text-gray-500">Contact:</span>
                  <span className="ml-2">{patient.contactNumber}</span>
                  <span className="text-gray-500 ml-4">Emergency:</span>
                  <span className="ml-2">{patient.emergencyContact}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {(patient.status === 'admitted' || patient.status === 'discharge-pending') && (
                  <Button 
                    size="sm" 
                    variant={patient.status === 'discharge-pending' ? 'default' : 'outline'}
                    onClick={() => onDischarge(patient.id)}
                  >
                    Discharge
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdmissionForm = ({ onSubmit, wards }: { 
  onSubmit: (data: Partial<IPDPatient>) => void,
  wards: Ward[]
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    age: '',
    gender: 'Male',
    wardName: '',
    roomNumber: '',
    bedNumber: '',
    expectedDischarge: '',
    attendingDoctor: '',
    condition: 'Stable',
    contactNumber: '',
    emergencyContact: '',
    diagnosis: '',
    admissionReason: ''
  });

  const doctors = [
    "Dr. Andi Wijaya",
    "Dr. Dewi Sutanto",
    "Dr. Budi Santoso",
    "Dr. Sarah Tanoto"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      age: Number(formData.age),
      expectedDischarge: formData.expectedDischarge ? new Date(formData.expectedDischarge) : undefined
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
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
          <Label>Patient ID</Label>
          <Input
            value={formData.patientId}
            onChange={(e) => setFormData({...formData, patientId: e.target.value})}
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
            onValueChange={(value) => setFormData({...formData, gender: value})}
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
          <Label>Ward</Label>
          <Select 
            value={formData.wardName}
            onValueChange={(value) => setFormData({...formData, wardName: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent>
              {wards.map(ward => (
                <SelectItem key={ward.id} value={ward.name}>
                  {ward.name} ({ward.availableBeds} available)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Room Number</Label>
          <Input
            value={formData.roomNumber}
            onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Bed Number</Label>
          <Input
            value={formData.bedNumber}
            onChange={(e) => setFormData({...formData, bedNumber: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Expected Discharge</Label>
          <Input
            type="date"
            value={formData.expectedDischarge}
            onChange={(e) => setFormData({...formData, expectedDischarge: e.target.value})}
          />
        </div>
        <div>
          <Label>Attending Doctor</Label>
          <Select 
            value={formData.attendingDoctor}
            onValueChange={(value) => setFormData({...formData, attendingDoctor: value})}
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
        <div>
          <Label>Condition</Label>
          <Select 
            value={formData.condition}
            onValueChange={(value) => setFormData({...formData, condition: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Stable">Stable</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Recovering">Recovering</SelectItem>
              <SelectItem value="Serious">Serious</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Contact Number</Label>
          <Input
            value={formData.contactNumber}
            onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Emergency Contact</Label>
          <Input
            value={formData.emergencyContact}
            onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label>Diagnosis</Label>
        <Input
          value={formData.diagnosis}
          onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
          required
        />
      </div>

      <div>
        <Label>Admission Reason</Label>
        <Textarea
          value={formData.admissionReason}
          onChange={(e) => setFormData({...formData, admissionReason: e.target.value})}
          placeholder="Reason for admission..."
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Admit Patient
      </Button>
    </form>
  );
};

export default IPDPage;
