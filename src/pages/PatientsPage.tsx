
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Users } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  address: string;
  email?: string;
  lastVisit?: Date;
}

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      mobile: "+1-555-123-4567",
      address: "123 Main St, Anytown",
      email: "john.doe@example.com",
      lastVisit: new Date(2023, 7, 15)
    },
    {
      id: "P002",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      mobile: "+1-555-987-6543",
      address: "456 Oak Ave, Somewhere",
      email: "jane.smith@example.com",
      lastVisit: new Date(2023, 7, 16)
    },
    {
      id: "P003",
      name: "Michael Brown",
      age: 58,
      gender: "Male",
      mobile: "+1-555-456-7890",
      address: "789 Pine Rd, Nowhere",
      lastVisit: new Date(2023, 7, 17)
    },
    {
      id: "P004",
      name: "Emily Davis",
      age: 27,
      gender: "Female",
      mobile: "+1-555-789-0123",
      address: "101 Maple Dr, Anywhere",
      email: "emily.davis@example.com",
      lastVisit: new Date(2023, 7, 12)
    },
    // Include patients from pharmacies and labs
    {
      id: "C1",
      name: "Yuda Rahmat",
      age: 35,
      gender: "Male",
      mobile: "+62-812-3456-7890",
      address: "123 Jakarta Street, Indonesia"
    },
    {
      id: "C2",
      name: "Aulia Akbar",
      age: 42,
      gender: "Female",
      mobile: "+62-813-5678-9012",
      address: "456 Bandung Road, Indonesia"
    },
    {
      id: "C3",
      name: "Sarah Johnson",
      age: 29,
      gender: "Female",
      mobile: "+1-555-987-6543",
      address: "456 Oak Ave, Somewhere"
    }
  ]);

  const filteredPatients = searchTerm
    ? patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mobile.includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : patients;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Patients Overview</CardTitle>
            <CardDescription>
              Manage all patients from pharmacy and lab services
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Input
                placeholder="Search patients..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">All Patients</TabsTrigger>
              <TabsTrigger value="pharmacy">Pharmacy Patients</TabsTrigger>
              <TabsTrigger value="lab">Lab Patients</TabsTrigger>
              <TabsTrigger value="recent">Recent Visits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <PatientTable patients={filteredPatients} />
            </TabsContent>
            
            <TabsContent value="pharmacy">
              <PatientTable 
                patients={filteredPatients.filter(p => 
                  p.id.startsWith("C")
                )} 
              />
            </TabsContent>
            
            <TabsContent value="lab">
              <PatientTable 
                patients={filteredPatients.filter(p => 
                  p.id.startsWith("P")
                )} 
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
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface PatientTableProps {
  patients: Patient[];
}

const PatientTable = ({ patients }: PatientTableProps) => {
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
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Age/Gender
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Visit
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map(patient => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                {patient.id}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.name}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.age} / {patient.gender}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.mobile}
                {patient.email && (
                  <div className="text-xs text-gray-400">{patient.email}</div>
                )}
              </td>
              <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                {patient.address}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.lastVisit 
                  ? patient.lastVisit.toLocaleDateString() 
                  : 'No visit recorded'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsPage;
