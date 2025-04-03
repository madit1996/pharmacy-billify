
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LabBillItem, LabWaitlistPatient } from "@/types/lab-types";
import { TestTubeIcon } from "./LabIcons";

interface LabWaitlistSidebarProps {
  waitlistPatients: LabWaitlistPatient[];
  onSelectPatient: (patient: LabWaitlistPatient) => void;
  collapsed: boolean;
}

const LabWaitlistSidebar = ({ 
  waitlistPatients, 
  onSelectPatient, 
  collapsed 
}: LabWaitlistSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

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
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => onSelectPatient(patient)}
              >
                {patient.id.substring(0, 2)}
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
                    patient.isHighlighted ? "bg-purple-50" : ""
                  }`}
                  onClick={() => onSelectPatient(patient)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      patient.isHighlighted 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {patient.id.substring(0, 2)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.items} tests</p>
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
                    <h4 className="text-sm font-medium mb-2">Recommended Tests</h4>
                    <div className="space-y-2">
                      {patient.tests.map((test) => (
                        <div key={test.id} className="text-xs p-2 border rounded bg-white">
                          <p className="font-medium">{test.testName}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-500">{test.category}</span>
                            <span className="text-purple-600">${test.price.toFixed(2)}</span>
                          </div>
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

export default LabWaitlistSidebar;
