
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientBillingDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    department: "",
    services: [] as { name: string; price: number; quantity: number }[],
    paymentMode: "",
    discount: 0,
    notes: ""
  });

  const departments = [
    "Emergency", "Cardiology", "Orthopedics", "Neurology", 
    "Pediatrics", "General Surgery", "ICU", "Laboratory", "Pharmacy"
  ];

  const handleAddService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: "", price: 0, quantity: 1 }]
    });
  };

  const handleRemoveService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };

  const handleServiceChange = (index: number, field: string, value: string | number) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, services: newServices });
  };

  const calculateTotal = () => {
    const subtotal = formData.services.reduce((sum, service) => 
      sum + (service.price * service.quantity), 0
    );
    return subtotal - formData.discount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const billNumber = `BILL${String(Date.now()).slice(-6)}`;
    
    toast({
      title: "Bill Generated",
      description: `Bill ${billNumber} created for ${formData.patientName}. Total: ₹${calculateTotal().toLocaleString()}`,
    });
    
    setOpen(false);
    setFormData({
      patientName: "",
      patientId: "",
      department: "",
      services: [],
      paymentMode: "",
      discount: 0,
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Bill
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Patient Bill</DialogTitle>
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

          <div>
            <Label>Department</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Services & Charges</Label>
              <Button type="button" onClick={handleAddService} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </Button>
            </div>
            
            {formData.services.map((service, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                <div className="col-span-5">
                  <Input
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                    placeholder="Service name"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={service.quantity}
                    onChange={(e) => handleServiceChange(index, "quantity", parseInt(e.target.value) || 1)}
                    placeholder="Qty"
                    min="1"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, "price", parseFloat(e.target.value) || 0)}
                    placeholder="Price"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-1">
                  <p className="text-sm font-medium">₹{(service.price * service.quantity).toFixed(2)}</p>
                </div>
                <div className="col-span-1">
                  <Button type="button" onClick={() => handleRemoveService(index)} variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">Discount (₹)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label>Payment Mode</Label>
              <Select value={formData.paymentMode} onValueChange={(value) => setFormData({...formData, paymentMode: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          {/* Bill Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Subtotal:</span>
              <span>₹{formData.services.reduce((sum, s) => sum + (s.price * s.quantity), 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Discount:</span>
              <span>-₹{formData.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Calculator className="mr-2 h-4 w-4" />
              Generate Bill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientBillingDialog;
