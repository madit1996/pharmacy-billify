import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BillItem } from "@/pages/PharmacyPage";

export type WaitlistPatient = {
  id: string;
  name: string;
  items: number;
  isHighlighted: boolean;
  prescriptions: BillItem[];
};

interface WaitlistSidebarProps {
  onSelectPatient: (patient: WaitlistPatient) => void;
  collapsed: boolean;
}

const WaitlistSidebar = ({ onSelectPatient, collapsed }: WaitlistSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data with prescriptions
  const waitlistPatients: WaitlistPatient[] = [
    {
      id: "A1",
      name: "Yuda Rahmat",
      items: 3,
      isHighlighted: true,
      prescriptions: [
        {
          id: "1",
          name: "Paracetamol Berno",
          price: 3.75,
          image: "https://medcitynews.com/uploads/2021/04/GettyImages-1204788864.jpg",
          dosage: "Take 1 tablet 3 times a day after meals",
          discount: 0,
          quantity: 1
        },
        {
          id: "2",
          name: "Insto Cool",
          price: 1.25,
          image: "https://insto.co.id/wp-content/uploads/2019/04/INSTO-COOL-e1555411322428.png",
          dosage: "Apply 1-2 drops in each eye 3-4 times daily",
          discount: 0,
          quantity: 1
        },
        {
          id: "3",
          name: "HI-D 5000 Vitamin",
          price: 2.10,
          image: "https://img.freepik.com/premium-photo/vitamin-d-capsules-orange-background_185193-9196.jpg",
          dosage: "Take 1 capsule daily with food",
          discount: 0,
          quantity: 1
        }
      ]
    },
    {
      id: "A2",
      name: "Aulia Akbar",
      items: 5,
      isHighlighted: false,
      prescriptions: [
        {
          id: "4",
          name: "Sanmol Tablets",
          price: 1.75,
          image: "https://cdn.shopify.com/s/files/1/0515/9661/6488/files/sanmol-strip.jpg",
          dosage: "Take 1-2 tablets every 4-6 hours as needed",
          discount: 0,
          quantity: 1
        },
        {
          id: "2",
          name: "Insto Cool",
          price: 1.25,
          image: "https://insto.co.id/wp-content/uploads/2019/04/INSTO-COOL-e1555411322428.png",
          dosage: "Apply 1-2 drops in each eye 3-4 times daily",
          discount: 0,
          quantity: 1
        },
        {
          id: "5",
          name: "Aspirin 100mg",
          price: 2.50,
          image: "https://www.drugs.com/images/pills/custom/pill24530-1/aspirin.jpg",
          dosage: "Take 1 tablet daily",
          discount: 5,
          quantity: 1
        },
        {
          id: "6",
          name: "Amoxicillin 500mg",
          price: 4.25,
          image: "https://www.drugs.com/images/pills/custom/pill13964-1/amoxicillin.jpg",
          dosage: "Take 1 capsule 3 times daily for 7 days",
          discount: 0,
          quantity: 1
        },
        {
          id: "7",
          name: "Cetirizine 10mg",
          price: 3.10,
          image: "https://www.drugs.com/images/pills/custom/pill17841-1/cetirizine-hydrochloride.jpg",
          dosage: "Take 1 tablet daily",
          discount: 0,
          quantity: 1
        }
      ]
    },
    {
      id: "A3",
      name: "Haul Anggara",
      items: 3,
      isHighlighted: false,
      prescriptions: [
        {
          id: "8",
          name: "Ibuprofen 400mg",
          price: 2.95,
          image: "https://www.drugs.com/images/pills/custom/pill15321-1/ibuprofen.jpg",
          dosage: "Take 1 tablet every 6-8 hours with food",
          discount: 0,
          quantity: 1
        },
        {
          id: "9",
          name: "Loratadine 10mg",
          price: 3.45,
          image: "https://www.drugs.com/images/pills/custom/pill7351-1/loratadine.jpg",
          dosage: "Take 1 tablet daily",
          discount: 10,
          quantity: 1
        },
        {
          id: "10",
          name: "Omeprazole 20mg",
          price: 5.20,
          image: "https://www.drugs.com/images/pills/custom/pill19239-1/omeprazole.jpg",
          dosage: "Take 1 capsule before breakfast",
          discount: 0,
          quantity: 1
        }
      ]
    },
    {
      id: "A4",
      name: "Mira Santoso",
      items: 2,
      isHighlighted: false,
      prescriptions: [
        {
          id: "11",
          name: "Simvastatin 20mg",
          price: 4.75,
          image: "https://www.drugs.com/images/pills/custom/pill17123-1/simvastatin.jpg",
          dosage: "Take 1 tablet at bedtime",
          discount: 0,
          quantity: 1
        },
        {
          id: "12",
          name: "Metformin 500mg",
          price: 3.80,
          image: "https://www.drugs.com/images/pills/custom/pill18108-1/metformin-hydrochloride.jpg",
          dosage: "Take 1 tablet twice daily with meals",
          discount: 0,
          quantity: 1
        }
      ]
    }
  ];

  const filteredPatients = searchTerm 
    ? waitlistPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : waitlistPatients;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b p-3">
        {!collapsed && <h3 className="font-medium">Waitlist</h3>}
      </div>
      
      {!collapsed && (
        <div className="p-3 border-b">
          <div className="relative">
            <Input 
              placeholder="Search patients"
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </div>
      )}
      
      <div className="overflow-y-auto flex-1">
        {collapsed ? (
          // Collapsed view - just show icons
          <div className="flex flex-col items-center py-2">
            {filteredPatients.map((patient) => (
              <div 
                key={patient.id} 
                className={`w-8 h-8 rounded-full flex items-center justify-center my-1 cursor-pointer ${
                  patient.isHighlighted 
                    ? "bg-green-100 text-pharmacy-primary" 
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => onSelectPatient(patient)}
              >
                {patient.id}
              </div>
            ))}
          </div>
        ) : (
          // Expanded view - show full details
          <div className="divide-y">
            {filteredPatients.map((patient) => (
              <Collapsible key={patient.id}>
                <div 
                  className={`p-3 flex items-center justify-between cursor-pointer ${
                    patient.isHighlighted ? "bg-green-50" : ""
                  }`}
                  onClick={() => onSelectPatient(patient)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      patient.isHighlighted 
                        ? "bg-green-100 text-pharmacy-primary" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {patient.id}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.items} items</p>
                    </div>
                  </div>
                  
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent>
                  <div className="p-3 bg-gray-50">
                    <h4 className="text-sm font-medium mb-2">Prescribed Medicines</h4>
                    <div className="space-y-2">
                      {patient.prescriptions.map((med) => (
                        <div key={med.id} className="text-xs p-2 border rounded bg-white">
                          <p className="font-medium">{med.name}</p>
                          <p className="text-gray-500 mt-1">{med.dosage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistSidebar;
