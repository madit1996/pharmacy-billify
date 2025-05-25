
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MLCRegistrationDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mlcNumber = `MLC${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}/2024`;
    toast({
      title: "MLC Case Registered",
      description: `MLC case ${mlcNumber} has been registered successfully.`,
    });
    setOpen(false);
    setFormData({
      patientName: "",
      age: "",
      gender: "",
      caseType: "",
      policeStation: "",
      officerName: "",
      priority: "",
      description: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register MLC
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Register MLC Case</DialogTitle>
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

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="caseType">Case Type</Label>
            <Select value={formData.caseType} onValueChange={(value) => setFormData({...formData, caseType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accident">Accident</SelectItem>
                <SelectItem value="Assault">Assault</SelectItem>
                <SelectItem value="Poisoning">Poisoning</SelectItem>
                <SelectItem value="Burn">Burn</SelectItem>
                <SelectItem value="Sexual Assault">Sexual Assault</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="policeStation">Police Station</Label>
            <Input
              id="policeStation"
              value={formData.policeStation}
              onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="officerName">Officer Name</Label>
            <Input
              id="officerName"
              value={formData.officerName}
              onChange={(e) => setFormData({...formData, officerName: e.target.value})}
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
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Register Case</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MLCRegistrationDialog;
