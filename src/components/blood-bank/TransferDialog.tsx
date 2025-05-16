import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogClose,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { BloodUnit, BloodStockTransfer } from "@/types/blood-bank";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromLocation?: string;
}

const TransferDialog = ({ open, onOpenChange, fromLocation }: TransferDialogProps) => {
  const { bloodUnits, addTransfer, getInventoryByLocation } = useBloodBankContext();

  const [source, setSource] = useState(fromLocation || "");
  const [destination, setDestination] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  
  // Get unique locations from blood units
  const locations = [...new Set(bloodUnits.map(unit => unit.location))];
  
  // Get available units at the source location
  const availableUnits = bloodUnits.filter(
    unit => unit.location === source && unit.status === 'available'
  );

  // Reset form when dialog opens/closes or source changes
  useEffect(() => {
    if (open) {
      setSource(fromLocation || "");
      setDestination("");
      setSelectedUnits({});
      setNote("");
      setRequestedBy("");
    }
  }, [open, fromLocation]);

  // Reset selected units when source changes
  useEffect(() => {
    setSelectedUnits({});
  }, [source]);

  const handleCheckUnit = (unitId: string, checked: boolean) => {
    setSelectedUnits(prev => ({ ...prev, [unitId]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedUnitIds = Object.entries(selectedUnits)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);
      
    if (selectedUnitIds.length === 0) {
      toast.error("Please select at least one blood unit to transfer");
      return;
    }
    
    if (source === destination) {
      toast.error("Source and destination locations cannot be the same");
      return;
    }

    const transferUnits = selectedUnitIds.map(unitId => {
      const unit = bloodUnits.find(u => u.id === unitId);
      return {
        unitId,
        bloodGroup: unit?.bloodGroup || "O+"
      };
    });

    const today = new Date().toISOString().split('T')[0];
    
    const newTransfer: Omit<BloodStockTransfer, "id"> = {
      fromLocation: source,
      toLocation: destination,
      units: transferUnits,
      transferDate: today,
      requestedBy: requestedBy || "Staff Member",
      approvedBy: "Lab Manager",
      status: "completed",
      notes: note
    };

    addTransfer(newTransfer);
    toast.success(`${selectedUnitIds.length} units successfully transferred to ${destination}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Transfer Blood Units</DialogTitle>
            <DialogDescription>
              Move blood units from one location to another
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source-location" className="text-right">
                From Location
              </Label>
              <Select value={source} onValueChange={setSource} required>
                <SelectTrigger id="source-location" className="col-span-3">
                  <SelectValue placeholder="Select source location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dest-location" className="text-right">
                To Location
              </Label>
              <Select value={destination} onValueChange={setDestination} required>
                <SelectTrigger id="dest-location" className="col-span-3">
                  <SelectValue placeholder="Select destination location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location} disabled={location === source}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requested-by" className="text-right">
                Requested By
              </Label>
              <Input
                id="requested-by"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Dr. Smith"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Notes
              </Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="col-span-3"
                placeholder="Any additional notes about this transfer"
              />
            </div>
            
            <div className="col-span-4 mt-2">
              <Label className="mb-2 block">Select Units to Transfer</Label>
              
              {source && availableUnits.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No available units at this location
                </p>
              )}
              
              <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                {availableUnits.map(unit => (
                  <div key={unit.id} className="flex items-center space-x-2 py-2 border-b last:border-0">
                    <Checkbox
                      id={`unit-${unit.id}`}
                      checked={selectedUnits[unit.id] || false}
                      onCheckedChange={(checked) => 
                        handleCheckUnit(unit.id, checked === true)
                      }
                    />
                    <Label htmlFor={`unit-${unit.id}`} className="flex-1">
                      <div className="flex items-center justify-between">
                        <div><span className="font-mono">{unit.id}</span> - {unit.bloodGroup}</div>
                        <div className="text-sm text-gray-500">
                          Expires: {unit.expiryDate}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="gap-1">
                <X className="h-4 w-4" /> Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="gap-1 bg-blue-600 hover:bg-blue-700">
              <Check className="h-4 w-4" /> Complete Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDialog;
