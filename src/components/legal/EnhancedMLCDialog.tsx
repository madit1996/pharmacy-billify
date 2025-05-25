
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnhancedMLCDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    caseType: "",
    policeStation: "",
    officerInCharge: "",
    admissionDate: "",
    priority: "Medium",
    description: "",
    staffAssigned: [] as string[],
    documents: [] as File[]
  });

  const caseTypes = [
    "Accident",
    "Assault",
    "Poisoning",
    "Burn",
    "Sexual Assault",
    "Suicide Attempt",
    "Domestic Violence",
    "Other"
  ];

  const handleAddStaff = () => {
    setFormData({
      ...formData,
      staffAssigned: [...formData.staffAssigned, ""]
    });
  };

  const handleRemoveStaff = (index: number) => {
    const newStaff = formData.staffAssigned.filter((_, i) => i !== index);
    setFormData({ ...formData, staffAssigned: newStaff });
  };

  const handleStaffChange = (index: number, value: string) => {
    const newStaff = [...formData.staffAssigned];
    newStaff[index] = value;
    setFormData({ ...formData, staffAssigned: newStaff });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        documents: [...formData.documents, ...Array.from(e.target.files)]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mlcNumber = `MLC${String(Date.now()).slice(-6)}/2024`;
    
    toast({
      title: "MLC Case Registered",
      description: `MLC case ${mlcNumber} has been successfully registered for ${formData.patientName}.`,
    });
    
    setOpen(false);
    setFormData({
      patientName: "",
      age: "",
      gender: "",
      caseType: "",
      policeStation: "",
      officerInCharge: "",
      admissionDate: "",
      priority: "Medium",
      description: "",
      staffAssigned: [],
      documents: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register New MLC
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New MLC Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Case Type *</Label>
              <Select value={formData.caseType} onValueChange={(value) => setFormData({...formData, caseType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Police Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="policeStation">Police Station *</Label>
              <Input
                id="policeStation"
                value={formData.policeStation}
                onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                placeholder="Enter police station name"
                required
              />
            </div>
            <div>
              <Label htmlFor="officerInCharge">Officer In-Charge *</Label>
              <Input
                id="officerInCharge"
                value={formData.officerInCharge}
                onChange={(e) => setFormData({...formData, officerInCharge: e.target.value})}
                placeholder="Enter officer name and rank"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admissionDate">Admission Date *</Label>
              <Input
                id="admissionDate"
                type="datetime-local"
                value={formData.admissionDate}
                onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Case Description */}
          <div>
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed description of the case..."
              rows={3}
            />
          </div>

          {/* Staff Assignment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Assigned Staff (Doctors, Nurses, Others)</Label>
              <Button type="button" onClick={handleAddStaff} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Staff
              </Button>
            </div>
            {formData.staffAssigned.map((staff, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={staff}
                  onChange={(e) => handleStaffChange(index, e.target.value)}
                  placeholder="Enter staff name and designation"
                  className="flex-1"
                />
                <Button type="button" onClick={() => handleRemoveStaff(index)} variant="outline" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Document Upload */}
          <div>
            <Label>Supporting Documents</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="document-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload documents</p>
                  <p className="text-xs text-gray-400">PDF, DOC, Images supported</p>
                </div>
              </label>
              {formData.documents.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Uploaded files:</p>
                  <ul className="text-sm text-gray-600">
                    {formData.documents.map((file, index) => (
                      <li key={index}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Register MLC Case</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedMLCDialog;
