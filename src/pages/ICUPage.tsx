
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
  Heart, 
  Users, 
  Plus,
  AlertTriangle,
  Activity,
  Clock,
  User,
  Stethoscope,
  Monitor
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ICUPatient {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  bedNumber: string;
  admissionDate: Date;
  attendingDoctor: string;
  condition: 'Critical' | 'Serious' | 'Stable' | 'Improving';
  diagnosis: string;
  contactNumber: string;
  emergencyContact: string;
  admissionReason: string;
  specialNotes?: string;
  ventilatorSupport: boolean;
  dialysisSupport: boolean;
  status: 'occupied' | 'vacant' | 'maintenance';
}

interface ICUBed {
  id: string;
  bedNumber: string;
  location: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  patientId?: string;
  equipment: string[];
  lastMaintenance: Date;
}

const ICUPage = () => {
  const [isAdmissionDialogOpen, setIsAdmissionDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<string>("");
  const { toast } = useToast();

  const icuBeds: ICUBed[] = [
    { id: "ICU001", bedNumber: "ICU-1", location: "ICU North Wing", status: "occupied", patientId: "ICUP001", equipment: ["Ventilator", "Heart Monitor", "IV Pump"], lastMaintenance: new Date(2024, 0, 10) },
    { id: "ICU002", bedNumber: "ICU-2", location: "ICU North Wing", status: "occupied", patientId: "ICUP002", equipment: ["Heart Monitor", "IV Pump", "Oxygen Support"], lastMaintenance: new Date(2024, 0, 12) },
    { id: "ICU003", bedNumber: "ICU-3", location: "ICU North Wing", status: "vacant", equipment: ["Ventilator", "Heart Monitor", "Dialysis Machine"], lastMaintenance: new Date(2024, 0, 15) },
    { id: "ICU004", bedNumber: "ICU-4", location: "ICU South Wing", status: "occupied", patientId: "ICUP003", equipment: ["Heart Monitor", "IV Pump"], lastMaintenance: new Date(2024, 0, 8) },
    { id: "ICU005", bedNumber: "ICU-5", location: "ICU South Wing", status: "vacant", equipment: ["Ventilator", "Heart Monitor", "IV Pump"], lastMaintenance: new Date(2024, 0, 14) },
    { id: "ICU006", bedNumber: "ICU-6", location: "ICU South Wing", status: "maintenance", equipment: ["Heart Monitor"], lastMaintenance: new Date(2024, 0, 5) }
  ];

  const [icuPatients, setIcuPatients] = useState<ICUPatient[]>([
    {
      id: "ICUP001",
      patientName: "James Wilson",
      patientId: "P101",
      age: 58,
      gender: "Male",
      bedNumber: "ICU-1",
      admissionDate: new Date(2024, 0, 14),
      attendingDoctor: "Dr. Andi Wijaya",
      condition: "Critical",
      diagnosis: "Acute Myocardial Infarction",
      contactNumber: "+1-555-111-2222",
      emergencyContact: "+1-555-111-9999",
      admissionReason: "Cardiac arrest, emergency admission",
      specialNotes: "Requires continuous cardiac monitoring",
      ventilatorSupport: true,
      dialysisSupport: false,
      status: "occupied"
    },
    {
      id: "ICUP002",
      patientName: "Linda Martinez",
      patientId: "P102",
      age: 42,
      gender: "Female",
      bedNumber: "ICU-2",
      admissionDate: new Date(2024, 0, 16),
      attendingDoctor: "Dr. Sarah Tanoto",
      condition: "Serious",
      diagnosis: "Severe Pneumonia with Respiratory Failure",
      contactNumber: "+1-555-222-3333",
      emergencyContact: "+1-555-222-9999",
      admissionReason: "Respiratory distress, transferred from ER",
      specialNotes: "High oxygen requirements",
      ventilatorSupport: false,
      dialysisSupport: false,
      status: "occupied"
    },
    {
      id: "ICUP003",
      patientName: "Robert Chen",
      patientId: "P103",
      age: 65,
      gender: "Male",
      bedNumber: "ICU-4",
      admissionDate: new Date(2024, 0, 13),
      attendingDoctor: "Dr. Budi Santoso",
      condition: "Improving",
      diagnosis: "Post-operative Complications",
      contactNumber: "+1-555-333-4444",
      emergencyContact: "+1-555-333-9999",
      admissionReason: "Post-surgical monitoring, kidney surgery complications",
      specialNotes: "Ready for step-down unit consideration",
      ventilatorSupport: false,
      dialysisSupport: true,
      status: "occupied"
    }
  ]);

  const occupiedBeds = icuBeds.filter(bed => bed.status === 'occupied').length;
  const availableBeds = icuBeds.filter(bed => bed.status === 'vacant').length;
  const maintenanceBeds = icuBeds.filter(bed => bed.status === 'maintenance').length;

  const criticalPatients = icuPatients.filter(p => p.condition === 'Critical').length;

  const handleAdmitPatient = (patientData: Partial<ICUPatient>) => {
    const availableBed = icuBeds.find(bed => bed.status === 'vacant');
    if (!availableBed) {
      toast({
        title: "No Available Beds",
        description: "All ICU beds are currently occupied or under maintenance",
        variant: "destructive"
      });
      return;
    }

    const newPatient: ICUPatient = {
      id: `ICUP${String(icuPatients.length + 1).padStart(3, '0')}`,
      patientName: patientData.patientName!,
      patientId: patientData.patientId!,
      age: patientData.age!,
      gender: patientData.gender!,
      bedNumber: availableBed.bedNumber,
      admissionDate: new Date(),
      attendingDoctor: patientData.attendingDoctor!,
      condition: patientData.condition as ICUPatient['condition'],
      diagnosis: patientData.diagnosis!,
      contactNumber: patientData.contactNumber!,
      emergencyContact: patientData.emergencyContact!,
      admissionReason: patientData.admissionReason!,
      specialNotes: patientData.specialNotes,
      ventilatorSupport: patientData.ventilatorSupport || false,
      dialysisSupport: patientData.dialysisSupport || false,
      status: "occupied"
    };

    setIcuPatients([...icuPatients, newPatient]);
    setIsAdmissionDialogOpen(false);
    
    toast({
      title: "Patient Admitted to ICU",
      description: `${patientData.patientName} has been admitted to ${availableBed.bedNumber}`,
    });
  };

  const handleDischarge = (patientId: string) => {
    const patient = icuPatients.find(p => p.id === patientId);
    if (patient) {
      setIcuPatients(icuPatients.filter(p => p.id !== patientId));
      
      toast({
        title: "Patient Discharged from ICU",
        description: `${patient.patientName} has been discharged from ICU`,
      });
    }
  };

  const getConditionBadge = (condition: ICUPatient['condition']) => {
    const conditionConfig = {
      'Critical': 'bg-red-100 text-red-800',
      'Serious': 'bg-orange-100 text-orange-800',
      'Stable': 'bg-yellow-100 text-yellow-800',
      'Improving': 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={conditionConfig[condition]}>
        {condition}
      </Badge>
    );
  };

  const getBedStatusBadge = (status: ICUBed['status']) => {
    const statusConfig = {
      'occupied': 'bg-red-100 text-red-800',
      'vacant': 'bg-green-100 text-green-800',
      'maintenance': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={statusConfig[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Intensive Care Unit (ICU)</h1>
        <Dialog open={isAdmissionDialogOpen} onOpenChange={setIsAdmissionDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Admit to ICU
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Admit Patient to ICU</DialogTitle>
            </DialogHeader>
            <ICUAdmissionForm onSubmit={handleAdmitPatient} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Critical Alert */}
      {criticalPatients > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Patients Alert ({criticalPatients})
            </CardTitle>
            <CardDescription className="text-red-700">
              Patients in critical condition requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {icuPatients.filter(p => p.condition === 'Critical').map(patient => (
                <div key={patient.id} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <span className="font-medium">{patient.patientName}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {patient.bedNumber} - {patient.diagnosis}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-700">
                      Dr. {patient.attendingDoctor}
                    </span>
                    {getConditionBadge(patient.condition)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ICU Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Beds</p>
                <h3 className="text-2xl font-bold">{icuBeds.length}</h3>
              </div>
              <Heart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Occupied</p>
                <h3 className="text-2xl font-bold text-red-600">{occupiedBeds}</h3>
              </div>
              <Users className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Available</p>
                <h3 className="text-2xl font-bold text-green-600">{availableBeds}</h3>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Maintenance</p>
                <h3 className="text-2xl font-bold text-yellow-600">{maintenanceBeds}</h3>
              </div>
              <Activity className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ICU Bed Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              ICU Bed Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {icuBeds.map(bed => {
                const patient = icuPatients.find(p => p.bedNumber === bed.bedNumber);
                return (
                  <div key={bed.id} className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{bed.bedNumber}</h4>
                      {getBedStatusBadge(bed.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{bed.location}</p>
                    {patient && (
                      <div className="text-sm">
                        <p className="font-medium">{patient.patientName}</p>
                        <p className="text-gray-600">Admitted: {patient.admissionDate.toLocaleDateString()}</p>
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Equipment:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {bed.equipment.map((eq, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              ICU Patients ({icuPatients.length})
            </CardTitle>
            <CardDescription>
              Current patients in intensive care
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Patients</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="support">Life Support</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ICUPatientList 
                  patients={icuPatients}
                  onDischarge={handleDischarge}
                />
              </TabsContent>
              
              <TabsContent value="critical">
                <ICUPatientList 
                  patients={icuPatients.filter(p => p.condition === 'Critical' || p.condition === 'Serious')}
                  onDischarge={handleDischarge}
                />
              </TabsContent>
              
              <TabsContent value="support">
                <ICUPatientList 
                  patients={icuPatients.filter(p => p.ventilatorSupport || p.dialysisSupport)}
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

const ICUPatientList = ({ patients, onDischarge }: { 
  patients: ICUPatient[], 
  onDischarge: (patientId: string) => void 
}) => {
  const getConditionBadge = (condition: ICUPatient['condition']) => {
    const conditionConfig = {
      'Critical': 'bg-red-100 text-red-800',
      'Serious': 'bg-orange-100 text-orange-800',
      'Stable': 'bg-yellow-100 text-yellow-800',
      'Improving': 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={conditionConfig[condition]}>
        {condition}
      </Badge>
    );
  };

  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                  <Badge variant="outline">{patient.bedNumber}</Badge>
                  {getConditionBadge(patient.condition)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Doctor:</span>
                    <p className="font-medium">{patient.attendingDoctor}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Admission:</span>
                    <p className="font-medium">{patient.admissionDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Diagnosis:</span>
                    <p className="font-medium">{patient.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Age/Gender:</span>
                    <p className="font-medium">{patient.age} / {patient.gender}</p>
                  </div>
                </div>

                <div className="flex gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className={patient.ventilatorSupport ? "text-red-600" : "text-gray-500"}>
                      Ventilator: {patient.ventilatorSupport ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span className={patient.dialysisSupport ? "text-blue-600" : "text-gray-500"}>
                      Dialysis: {patient.dialysisSupport ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {patient.specialNotes && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-sm">Special Notes:</span>
                    <p className="text-sm italic">{patient.specialNotes}</p>
                  </div>
                )}

                <div className="mt-3 text-sm">
                  <span className="text-gray-500">Contact:</span>
                  <span className="ml-2">{patient.contactNumber}</span>
                  <span className="text-gray-500 ml-4">Emergency:</span>
                  <span className="ml-2">{patient.emergencyContact}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDischarge(patient.id)}
                >
                  Discharge
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ICUAdmissionForm = ({ onSubmit }: { 
  onSubmit: (data: Partial<ICUPatient>) => void
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    age: '',
    gender: 'Male',
    attendingDoctor: '',
    condition: 'Serious' as ICUPatient['condition'],
    diagnosis: '',
    contactNumber: '',
    emergencyContact: '',
    admissionReason: '',
    specialNotes: '',
    ventilatorSupport: false,
    dialysisSupport: false
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
      age: Number(formData.age)
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
            onValueChange={(value) => setFormData({...formData, condition: value as ICUPatient['condition']})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Serious">Serious</SelectItem>
              <SelectItem value="Stable">Stable</SelectItem>
              <SelectItem value="Improving">Improving</SelectItem>
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
          placeholder="Reason for ICU admission..."
          required
        />
      </div>

      <div>
        <Label>Special Notes</Label>
        <Textarea
          value={formData.specialNotes}
          onChange={(e) => setFormData({...formData, specialNotes: e.target.value})}
          placeholder="Any special instructions or notes..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="ventilator"
            checked={formData.ventilatorSupport}
            onChange={(e) => setFormData({...formData, ventilatorSupport: e.target.checked})}
          />
          <Label htmlFor="ventilator">Ventilator Support Required</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="dialysis"
            checked={formData.dialysisSupport}
            onChange={(e) => setFormData({...formData, dialysisSupport: e.target.checked})}
          />
          <Label htmlFor="dialysis">Dialysis Support Required</Label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Admit to ICU
      </Button>
    </form>
  );
};

export default ICUPage;
