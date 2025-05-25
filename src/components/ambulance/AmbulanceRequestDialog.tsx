
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AmbulanceRequestDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    contactNumber: "",
    pickupLocation: "",
    destination: "",
    priority: "",
    patientCondition: "",
    requestedBy: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestId = `AMB${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    toast({
      title: "Ambulance Request Logged",
      description: `Request ${requestId} has been created and dispatch team has been notified.`,
    });
    setOpen(false);
    setFormData({
      patientName: "",
      contactNumber: "",
      pickupLocation: "",
      destination: "",
      priority: "",
      patientCondition: "",
      requestedBy: "",
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Ambulance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="pickupLocation">Pickup Location</Label>
            <Textarea
              id="pickupLocation"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="patientCondition">Patient Condition</Label>
            <Textarea
              id="patientCondition"
              value={formData.patientCondition}
              onChange={(e) => setFormData({...formData, patientCondition: e.target.value})}
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="requestedBy">Requested By</Label>
            <Input
              id="requestedBy"
              value={formData.requestedBy}
              onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AmbulanceRequestDialog;
