
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VehicleAssignDialogProps {
  requestId: string;
}

const VehicleAssignDialog = ({ requestId }: VehicleAssignDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [assignmentData, setAssignmentData] = useState({
    vehicleNumber: "",
    driverName: "",
    estimatedTime: ""
  });

  const vehicles = [
    { number: "AMB-001", driver: "John Driver", status: "Available" },
    { number: "AMB-002", driver: "Mike Johnson", status: "Available" },
    { number: "AMB-003", driver: "Tom Wilson", status: "Available" }
  ];

  const handleAssign = () => {
    toast({
      title: "Vehicle Assigned",
      description: `${assignmentData.vehicleNumber} has been assigned to request ${requestId}.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Truck className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Vehicle - {requestId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="vehicleNumber">Available Vehicles</Label>
            <Select 
              value={assignmentData.vehicleNumber} 
              onValueChange={(value) => {
                const vehicle = vehicles.find(v => v.number === value);
                setAssignmentData({
                  ...assignmentData, 
                  vehicleNumber: value,
                  driverName: vehicle?.driver || ""
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.number} value={vehicle.number}>
                    {vehicle.number} - {vehicle.driver} ({vehicle.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {assignmentData.driverName && (
            <div>
              <Label>Assigned Driver</Label>
              <div className="p-2 bg-gray-50 rounded">{assignmentData.driverName}</div>
            </div>
          )}

          <div>
            <Label htmlFor="estimatedTime">Estimated Arrival (minutes)</Label>
            <Select 
              value={assignmentData.estimatedTime} 
              onValueChange={(value) => setAssignmentData({...assignmentData, estimatedTime: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ETA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!assignmentData.vehicleNumber}>
              Assign Vehicle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleAssignDialog;
