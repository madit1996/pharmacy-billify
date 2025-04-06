
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
import { CalendarIcon, Clock, Home, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { TimePicker } from "@/components/ui/time-picker";

// Define a type for the time selection
interface TimeSelection {
  hours: string;
  minutes: string;
  ampm: 'AM' | 'PM';
}

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
  { id: "R4", name: "John Miller", role: "Lab Assistant" },
  { id: "R5", name: "David Wilson", role: "Collection Specialist" }
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
  const [selectedTime, setSelectedTime] = useState<TimeSelection>({
    hours: "09",
    minutes: "00",
    ampm: "AM"
  });

  const { toast } = useToast();
  
  const handleAssignRepresentative = (testId: string, repId: string) => {
    if (assignTestToRepresentative && repId !== "all") {
      assignTestToRepresentative(testId, repId);
    }
  };

  // Apply home collection settings to bill items
  const applyHomeCollection = () => {
    if (!onUpdateSampleDetails) return;
    
    // Convert time to a proper format
    const hours = selectedTime.ampm === 'PM' && selectedTime.hours !== '12' 
      ? parseInt(selectedTime.hours) + 12 
      : (selectedTime.ampm === 'AM' && selectedTime.hours === '12' ? 0 : parseInt(selectedTime.hours));
    
    const collectionDateTime = new Date(homeCollectionData.collectionDate);
    collectionDateTime.setHours(hours);
    collectionDateTime.setMinutes(parseInt(selectedTime.minutes));
    
    // Generate a collection address
    const collectionAddress = homeCollectionData.usePatientAddress && selectedCustomer 
      ? selectedCustomer.address 
      : homeCollectionData.address;
    
    if (!collectionAddress) {
      toast({
        title: "Address required",
        description: "Please provide a collection address",
        variant: "destructive"
      });
      return;
    }
    
    // Apply to all items
    billItems.forEach(item => {
      onUpdateSampleDetails(
        item.id, 
        homeCollectionData.collectionNotes,
        item.sampleId
      );
      
      // Mark these items as home collection with address details
      item.isHomeCollection = true;
      item.collectionAddress = collectionAddress;
      item.collectionDateTime = collectionDateTime;
      item.collectionNotes = homeCollectionData.collectionNotes;
    });
    
    setShowHomeCollectionDetails(false);
    
    toast({
      title: "Home collection setup",
      description: `Home collection scheduled for ${format(collectionDateTime, "PPP 'at' h:mm a")}`,
    });
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

  // Find a collection specialist
  const collectionSpecialist = representatives.find(rep => rep.role === "Collection Specialist");

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

      {/* Home Collection Info Banner - Shows when home collection is active */}
      {hasHomeCollectionItems && (
        <div className="px-4 py-3 bg-blue-50 border-y border-blue-100">
          <div className="flex items-start space-x-2">
            <Home className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-800">Home Collection Active</h4>
              {billItems[0].collectionAddress && (
                <div className="text-sm text-blue-700 mt-1 flex items-start">
                  <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5 text-blue-500" />
                  <span>{billItems[0].collectionAddress}</span>
                </div>
              )}
              {billItems[0].collectionDateTime && (
                <div className="text-sm text-blue-700 mt-1 flex items-start">
                  <Clock className="h-3.5 w-3.5 mr-1 mt-0.5 text-blue-500" />
                  <span>{format(billItems[0].collectionDateTime, "PPP 'at' h:mm a")}</span>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white whitespace-nowrap"
              onClick={() => setShowHomeCollectionDetails(true)}
            >
              Edit Details
            </Button>
          </div>
        </div>
      )}

      {/* Home Collection Setup Button - Only show when no home collection is set */}
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
        </div>
      )}
      
      {/* Home Collection Details Form */}
      {showHomeCollectionDetails && (
        <Card className="m-4 border-blue-200">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium text-blue-800 flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home Collection Setup
            </h3>
            
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collection-date">Collection Date</Label>
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
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Collection Time</Label>
                <div className="flex items-center space-x-2">
                  <Select 
                    value={selectedTime.hours}
                    onValueChange={(value) => setSelectedTime(prev => ({ ...prev, hours: value }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                        <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                          {hour.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span>:</span>
                  
                  <Select 
                    value={selectedTime.minutes}
                    onValueChange={(value) => setSelectedTime(prev => ({ ...prev, minutes: value }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['00', '15', '30', '45'].map(minute => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={selectedTime.ampm}
                    onValueChange={(value) => setSelectedTime(prev => ({ ...prev, ampm: value as 'AM' | 'PM' }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
            
            <div className="space-y-2">
              <Label htmlFor="collection-specialist">Assign Collection Specialist</Label>
              <Select 
                defaultValue={collectionSpecialist?.id}
              >
                <SelectTrigger id="collection-specialist">
                  <SelectValue placeholder="Select a specialist" />
                </SelectTrigger>
                <SelectContent>
                  {representatives
                    .filter(rep => rep.role.includes("Collection") || rep.role.includes("Lab Assistant"))
                    .map(rep => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name} ({rep.role})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
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
          </CardContent>
        </Card>
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
