
import { useState } from "react";
import { User, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PatientType = {
  id: number;
  name: string;
  gender: string;
  age: number;
  diagnosis: string;
};

type BedType = {
  id: string;
  status: string;
  patientId: number | null;
  patientName: string | null;
  admissionDate: Date | null;
  expectedDischarge: Date | null;
};

type BedAssignDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBed: BedType | null;
  patients: PatientType[];
  onAssign: () => void;
  selectedPatient: PatientType | null;
  setSelectedPatient: (patient: PatientType | null) => void;
};

const BedAssignDialog = ({
  open,
  onOpenChange,
  selectedBed,
  patients,
  onAssign,
  selectedPatient,
  setSelectedPatient
}: BedAssignDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = searchTerm.trim() === "" 
    ? patients 
    : patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toString().includes(searchTerm) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Patient to Bed {selectedBed?.id}</DialogTitle>
          <DialogDescription>
            Select a patient to assign to this bed
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto border rounded-md">
            {filteredPatients.map(patient => (
              <div
                key={patient.id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedPatient?.id === patient.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-500">
                      ID: {patient.id} • {patient.gender}, {patient.age} yrs • {patient.diagnosis}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAssign} disabled={!selectedPatient}>
            Assign Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BedAssignDialog;
