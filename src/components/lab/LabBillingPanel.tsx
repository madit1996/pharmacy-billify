
import { LabBillItem, LabCustomer, LabTestRepresentative } from "@/types/lab-types";
import CustomerSearch from "./CustomerSearch";
import BillItem from "./BillItem";
import BillSummary from "./BillSummary";
import { BeakerIcon } from "./LabIcons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface LabBillingPanelProps {
  billItems: LabBillItem[];
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  subtotal: number;
  platformFee: number;
  total: number;
  onPrintBill: () => void;
  customerName?: string;
  customers: LabCustomer[];
  selectedCustomer: LabCustomer | null;
  onSelectCustomer: (customer: LabCustomer) => void;
  onAddNewCustomer: () => void;
  onEditCustomer?: () => void;
  searchTerm: string;
  onSearchCustomer: (term: string) => void;
  assignTestToRepresentative?: (testId: string, representativeId: string) => void;
  onUpdateStatus?: (id: string, status: string, estimatedTime?: string) => void;
  onUpdateSampleDetails?: (id: string, details: string) => void;
}

const representatives: LabTestRepresentative[] = [
  { id: "R1", name: "Dr. Sarah Smith", role: "Lab Technician" },
  { id: "R2", name: "Dr. Robert Johnson", role: "Pathologist" },
  { id: "R3", name: "Dr. Emily Williams", role: "Radiologist" },
  { id: "R4", name: "John Miller", role: "Lab Assistant" }
];

const LabBillingPanel = ({
  billItems,
  updateItemQuantity,
  removeItem,
  subtotal,
  platformFee,
  total,
  onPrintBill,
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddNewCustomer,
  onEditCustomer,
  searchTerm,
  onSearchCustomer,
  assignTestToRepresentative,
  onUpdateStatus,
  onUpdateSampleDetails
}: LabBillingPanelProps) => {
  const [selectedRepresentative, setSelectedRepresentative] = useState<string>("all");
  
  const handleAssignRepresentative = (testId: string, repId: string) => {
    if (assignTestToRepresentative && repId !== "all") {
      assignTestToRepresentative(testId, repId);
    }
  };

  // Group bill items by patient
  const groupedBillItems = billItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, LabBillItem[]>);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500">
        <CustomerSearch 
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={onSelectCustomer}
          onAddNewCustomer={onAddNewCustomer}
          onEditCustomer={onEditCustomer}
          searchTerm={searchTerm}
          onSearchCustomer={onSearchCustomer}
        />
      </div>

      {assignTestToRepresentative && (
        <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-gray-100">
          <div className="flex items-center space-x-3">
            <Label htmlFor="rep-select" className="text-sm font-medium whitespace-nowrap">
              Assign to:
            </Label>
            <Select 
              value={selectedRepresentative} 
              onValueChange={setSelectedRepresentative}
            >
              <SelectTrigger id="rep-select" className="h-8 text-sm flex-1">
                <SelectValue placeholder="Select representative" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Representatives</SelectItem>
                {representatives.map(rep => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name} ({rep.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="px-4 py-2 bg-gradient-to-r from-slate-800 to-gray-700 text-white flex items-center justify-between text-xs">
        <div className="text-left">Test</div>
        <div className="text-center">Qty</div>
        <div className="text-right">Price</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 bg-white">
        {billItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <BeakerIcon className="h-12 w-12 mb-2 opacity-30" />
            <p>No tests added to the bill yet</p>
            <p className="text-xs mt-2">Search or select lab tests to add them to the bill</p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedBillItems).map(([category, items]) => (
              <div key={category} className="mb-4">
                <h3 className="text-sm font-medium uppercase text-gray-500 mb-2">{category}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <BillItem 
                      key={item.id}
                      item={item}
                      updateItemQuantity={updateItemQuantity}
                      removeItem={removeItem}
                      onAssign={assignTestToRepresentative ? 
                        (testId) => handleAssignRepresentative(testId, selectedRepresentative) : 
                        undefined
                      }
                      representatives={representatives}
                      onUpdateStatus={onUpdateStatus}
                      onUpdateSampleDetails={onUpdateSampleDetails}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t bg-gradient-to-b from-white to-slate-50">
        <div className="p-4">
          <BillSummary
            subtotal={subtotal}
            platformFee={platformFee}
            total={total}
            onPrintBill={onPrintBill}
          />
        </div>
      </div>
    </div>
  );
};

export default LabBillingPanel;
