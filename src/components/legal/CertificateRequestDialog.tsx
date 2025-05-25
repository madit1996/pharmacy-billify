
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CertificateRequestDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: "",
    patientName: "",
    requestedBy: "",
    requiredDate: "",
    fees: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Certificate Request Created",
      description: `Request for ${formData.type} certificate has been submitted.`,
    });
    setOpen(false);
    setFormData({
      type: "",
      patientName: "",
      requestedBy: "",
      requiredDate: "",
      fees: "",
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
          <DialogTitle>New Certificate Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Certificate Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Birth">Birth Certificate</SelectItem>
                <SelectItem value="Death">Death Certificate</SelectItem>
                <SelectItem value="Medical Fitness">Medical Fitness Certificate</SelectItem>
                <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="requestedBy">Requested By</Label>
            <Input
              id="requestedBy"
              value={formData.requestedBy}
              onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="requiredDate">Required Date</Label>
            <Input
              id="requiredDate"
              type="date"
              value={formData.requiredDate}
              onChange={(e) => setFormData({...formData, requiredDate: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="fees">Fees (₹)</Label>
            <Input
              id="fees"
              type="number"
              value={formData.fees}
              onChange={(e) => setFormData({...formData, fees: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
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

export default CertificateRequestDialog;
