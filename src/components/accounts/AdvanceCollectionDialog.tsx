
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdvanceCollectionDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    amount: 0,
    purpose: "",
    paymentMode: "",
    collectedBy: "",
    notes: ""
  });

  const purposes = [
    "Surgery Deposit",
    "Treatment Package",
    "Emergency Admission",
    "ICU Admission", 
    "Procedure Advance",
    "Investigation Package",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const receiptNumber = `ADV${String(Date.now()).slice(-6)}`;
    
    toast({
      title: "Advance Collected",
      description: `Receipt ${receiptNumber} generated. Amount: ₹${formData.amount.toLocaleString()} collected from ${formData.patientName}`,
    });
    
    setOpen(false);
    setFormData({
      patientName: "",
      patientId: "",
      amount: 0,
      purpose: "",
      paymentMode: "",
      collectedBy: "",
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Collect Advance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Collect Patient Advance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientId">Patient ID *</Label>
              <Input
                id="patientId"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                placeholder="Search patient by ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label>Purpose *</Label>
              <Select value={formData.purpose} onValueChange={(value) => setFormData({...formData, purpose: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map(purpose => (
                    <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Payment Mode *</Label>
              <Select value={formData.paymentMode} onValueChange={(value) => setFormData({...formData, paymentMode: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="collectedBy">Collected By *</Label>
              <Input
                id="collectedBy"
                value={formData.collectedBy}
                onChange={(e) => setFormData({...formData, collectedBy: e.target.value})}
                placeholder="Staff name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <CreditCard className="mr-2 h-4 w-4" />
              Collect Advance
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdvanceCollectionDialog;
