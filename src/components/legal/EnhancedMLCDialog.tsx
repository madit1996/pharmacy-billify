
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnhancedMLCDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [staffList, setStaffList] = useState([{ name: "", role: "", department: "" }]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    caseType: "",
    policeStation: "",
    officerName: "",
    priority: "",
    description: ""
  });

  const addStaffMember = () => {
    setStaffList([...staffList, { name: "", role: "", department: "" }]);
  };

  const removeStaffMember = (index: number) => {
    setStaffList(staffList.filter((_, i) => i !== index));
  };

  const updateStaffMember = (index: number, field: string, value: string) => {
    const updated = staffList.map((staff, i) => 
      i === index ? { ...staff, [field]: value } : staff
    );
    setStaffList(updated);
  };

  const handleFileUpload = () => {
    setDocuments([...documents, `Document_${documents.length + 1}.pdf`]);
    toast({
      title: "Document Uploaded",
      description: "Supporting document has been uploaded successfully.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "MLC Case Registered",
      description: `New MLC case for ${formData.patientName} has been registered.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register New MLC
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New MLC Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Staff Members Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Medical Staff Involved</Label>
              <Button type="button" onClick={addStaffMember} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Staff
              </Button>
            </div>
            {staffList.map((staff, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 p-3 border rounded">
                <Input
                  placeholder="Staff Name"
                  value={staff.name}
                  onChange={(e) => updateStaffMember(index, 'name', e.target.value)}
                />
                <Select value={staff.role} onValueChange={(value) => updateStaffMember(index, 'role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                    <SelectItem value="Support Staff">Support Staff</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Department"
                  value={staff.department}
                  onChange={(e) => updateStaffMember(index, 'department', e.target.value)}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => removeStaffMember(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Supporting Documents</Label>
              <Button type="button" onClick={handleFileUpload} size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Upload Document
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center p-2 border rounded">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="flex-1">{doc}</span>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              placeholder="Detailed description of the case..."
            />
          </div>

          <div className="flex justify-end space-x-2">
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
