
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { CustomerDetails } from "@/pages/PharmacyPage";
import { useToast } from "@/hooks/use-toast";

interface PatientFormProps {
  patient: CustomerDetails;
  onSave: (patient: CustomerDetails) => void;
  onCancel: () => void;
}

const PatientForm = ({ patient, onSave, onCancel }: PatientFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CustomerDetails>({
    id: patient.id,
    name: patient.name,
    mobile: patient.mobile || "",
    address: patient.address || "",
    email: patient.email || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Missing information",
        description: "Patient name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.mobile.trim()) {
      toast({
        title: "Missing information",
        description: "Mobile number is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.address.trim()) {
      toast({
        title: "Missing information",
        description: "Address is required",
        variant: "destructive"
      });
      return;
    }
    
    // Save the patient data
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="mobile" className="text-right">
            Mobile
          </Label>
          <Input
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="address" className="text-right">
            Address
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Optional"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
};

export default PatientForm;
