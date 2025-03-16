
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BedGrid from "@/components/bed-management/BedGrid";
import BedList from "@/components/bed-management/BedList";
import BedFilters from "@/components/bed-management/BedFilters";
import BedAssignDialog from "@/components/bed-management/BedAssignDialog";
import BedAnalytics from "@/components/bed-management/BedAnalytics";
import { 
  initialWards, 
  samplePatients, 
  occupancyData, 
  bedTurnoverData, 
  averageStayData 
} from "@/utils/bedManagementData";

const BedManagementPage = () => {
  const [wards, setWards] = useState(initialWards);
  const [selectedWard, setSelectedWard] = useState(initialWards[0]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const handleBedClick = (bed: any) => {
    setSelectedBed(bed);
    
    if (bed.status === "available") {
      setIsAssignDialogOpen(true);
    } else {
      // Show bed details or discharge dialog
      console.log("Bed details:", bed);
    }
  };
  
  const handleAssignBed = () => {
    if (!selectedBed || !selectedPatient) return;
    
    // Update the bed status and patient info
    const updatedWards = wards.map(ward => {
      if (ward.id === selectedWard.id) {
        const updatedBeds = ward.beds.map(bed => {
          if (bed.id === selectedBed.id) {
            return {
              ...bed,
              status: "occupied",
              patientId: selectedPatient.id,
              patientName: selectedPatient.name,
              admissionDate: new Date(),
              expectedDischarge: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            };
          }
          return bed;
        });
        
        return {
          ...ward,
          beds: updatedBeds,
          availableBeds: ward.availableBeds - 1
        };
      }
      return ward;
    });
    
    setWards(updatedWards);
    setSelectedWard(updatedWards.find(w => w.id === selectedWard.id)!);
    setIsAssignDialogOpen(false);
    setSelectedBed(null);
    setSelectedPatient(null);
  };
  
  const dischargeBed = (wardId: number, bedId: string) => {
    const updatedWards = wards.map(ward => {
      if (ward.id === wardId) {
        const updatedBeds = ward.beds.map(bed => {
          if (bed.id === bedId) {
            return {
              ...bed,
              status: "available",
              patientId: null,
              patientName: null,
              admissionDate: null,
              expectedDischarge: null,
            };
          }
          return bed;
        });
        
        return {
          ...ward,
          beds: updatedBeds,
          availableBeds: ward.availableBeds + 1
        };
      }
      return ward;
    });
    
    setWards(updatedWards);
    setSelectedWard(updatedWards.find(w => w.id === selectedWard.id)!);
  };
  
  // Filter beds based on search term
  const filteredBeds = selectedWard.beds.filter(bed => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      bed.id.toLowerCase().includes(searchLower) ||
      (bed.patientName && bed.patientName.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="container mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-6">Bed Management</h1>
      
      <Tabs defaultValue="beds" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="beds">Bed Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="beds" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <BedFilters
              wards={wards}
              selectedWard={selectedWard}
              setSelectedWard={setSelectedWard}
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            
            {viewMode === "grid" ? (
              <BedGrid
                beds={filteredBeds}
                onBedClick={handleBedClick}
                onAssignClick={(bed) => {
                  setSelectedBed(bed);
                  setIsAssignDialogOpen(true);
                }}
                onDischargeClick={dischargeBed}
                wardId={selectedWard.id}
              />
            ) : (
              <BedList
                beds={filteredBeds}
                onAssignClick={(bed) => {
                  setSelectedBed(bed);
                  setIsAssignDialogOpen(true);
                }}
                onDischargeClick={dischargeBed}
                wardId={selectedWard.id}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <BedAnalytics
            wards={wards}
            occupancyData={occupancyData}
            bedTurnoverData={bedTurnoverData}
            averageStayData={averageStayData}
          />
        </TabsContent>
      </Tabs>
      
      <BedAssignDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        selectedBed={selectedBed}
        patients={samplePatients}
        onAssign={handleAssignBed}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
      />
    </div>
  );
};

export default BedManagementPage;
