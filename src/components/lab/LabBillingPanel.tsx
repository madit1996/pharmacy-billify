
import { LabBillItem, LabCustomer, LabTestRepresentative } from "@/types/lab-types";
import CustomerSearch from "./CustomerSearch";
import BillItem from "./BillItem";
import BillSummary from "./BillSummary";
import { BeakerIcon } from "./LabIcons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Home } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  onUpdateSampleDetails?: (id: string, details: string, sampleId?: string) => void;
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
  const [showHomeCollectionDetails, setShowHomeCollectionDetails] = useState(false);
  const [homeCollectionData, setHomeCollectionData] = useState({
    address: selectedCustomer?.address || "",
    collectionDate: new Date(),
    collectionNotes: "",
    usePatientAddress: true
  });
  
  const handleAssignRepresentative = (testId: string, repId: string) => {
    if (assignTestToRepresentative && repId !== "all") {
      assignTestToRepresentative(testId, repId);
    }
  };

  // Apply home collection settings to bill items
  const applyHomeCollection = () => {
    if (!onUpdateSampleDetails) return;
    
    // Apply to all items
    billItems.forEach(item => {
      onUpdateSampleDetails(
        item.id, 
        homeCollectionData.collectionNotes,
        item.sampleId
      );
      
      // Mark these items as home collection with address details
      item.isHomeCollection = true;
      item.collectionAddress = homeCollectionData.usePatientAddress && selectedCustomer 
        ? selectedCustomer.address 
        : homeCollectionData.address;
      item.collectionDateTime = homeCollectionData.collectionDate;
      item.collectionNotes = homeCollectionData.collectionNotes;
    });
    
    setShowHomeCollectionDetails(false);
  };

  // Group bill items by patient
  const groupedBillItems = billItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, LabBillItem[]>);

  // Check if any tests are marked for home collection
  const hasHomeCollectionItems = billItems.some(item => item.isHomeCollection);

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

      {/* Home Collection Toggle */}
      {billItems.length > 0 && !hasHomeCollectionItems && (
        <div className="px-4 py-3 bg-blue-50 border-y border-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Home Collection</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white"
              onClick={() => setShowHomeCollectionDetails(true)}
            >
              Setup
            </Button>
          </div>
          
          {showHomeCollectionDetails && (
            <div className="mt-3 space-y-4 p-3 bg-white rounded-md border border-blue-100">
              <div className="flex items-start gap-2">
                <Checkbox 
                  id="use-patient-address" 
                  checked={homeCollectionData.usePatientAddress}
                  onCheckedChange={(checked) => 
                    setHomeCollectionData(prev => ({
                      ...prev, 
                      usePatientAddress: checked === true
                    }))
                  }
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="use-patient-address">
                    Use patient address for collection
                  </Label>
                  {selectedCustomer?.address && (
                    <p className="text-xs text-gray-500">{selectedCustomer.address}</p>
                  )}
                </div>
              </div>
              
              {!homeCollectionData.usePatientAddress && (
                <div className="space-y-2">
                  <Label htmlFor="collection-address">Collection Address</Label>
                  <Textarea 
                    id="collection-address"
                    placeholder="Enter full collection address"
                    value={homeCollectionData.address}
                    onChange={(e) => 
                      setHomeCollectionData(prev => ({
                        ...prev,
                        address: e.target.value
                      }))
                    }
                    rows={3}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="collection-date">Collection Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="collection-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {homeCollectionData.collectionDate ? (
                        format(homeCollectionData.collectionDate, "PPP")
                      ) : (
                        <span>Select collection date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={homeCollectionData.collectionDate}
                      onSelect={(date) => 
                        setHomeCollectionData(prev => ({
                          ...prev,
                          collectionDate: date || new Date()
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="collection-notes">Special Instructions</Label>
                <Textarea 
                  id="collection-notes"
                  placeholder="Any special instructions for collection"
                  value={homeCollectionData.collectionNotes}
                  onChange={(e) => 
                    setHomeCollectionData(prev => ({
                      ...prev,
                      collectionNotes: e.target.value
                    }))
                  }
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowHomeCollectionDetails(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={applyHomeCollection}
                >
                  Apply to All Tests
                </Button>
              </div>
            </div>
          )}
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
