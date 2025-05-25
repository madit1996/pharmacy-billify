
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mail, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConsentRequestDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [requestMethod, setRequestMethod] = useState("email");
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    patientEmail: "",
    consentType: "",
    procedureDetails: "",
    doctorName: "",
    department: "",
    scheduledDate: "",
    urgency: "Normal"
  });

  const consentTypes = [
    "Surgery Consent",
    "Anesthesia Consent", 
    "Blood Transfusion Consent",
    "Procedure Consent",
    "Treatment Consent",
    "Research Participation",
    "Organ Donation"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestMethod === "email") {
      toast({
        title: "Consent Request Sent",
        description: `Email sent to ${formData.patientEmail} for ${formData.consentType}.`,
      });
    } else {
      toast({
        title: "Digital Consent Form Opened",
        description: `Consent form ready for digital signature by patient/family.`,
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Request Consent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Patient Consent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                placeholder="Search patient..."
                required
              />
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
          </div>

          <div>
            <Label htmlFor="consentType">Consent Type</Label>
            <Select value={formData.consentType} onValueChange={(value) => setFormData({...formData, consentType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select consent type" />
              </SelectTrigger>
              <SelectContent>
                {consentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Request Method</Label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={requestMethod === "email"}
                  onChange={(e) => setRequestMethod(e.target.value)}
                  className="mr-2"
                />
                Email to Patient
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="digital"
                  checked={requestMethod === "digital"}
                  onChange={(e) => setRequestMethod(e.target.value)}
                  className="mr-2"
                />
                Digital Signature
              </label>
            </div>
          </div>

          {requestMethod === "email" && (
            <div>
              <Label htmlFor="patientEmail">Patient Email</Label>
              <Input
                id="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                id="doctorName"
                value={formData.doctorName}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="procedureDetails">Procedure/Treatment Details</Label>
            <Textarea
              id="procedureDetails"
              value={formData.procedureDetails}
              onChange={(e) => setFormData({...formData, procedureDetails: e.target.value})}
              rows={3}
              placeholder="Detailed description of the procedure/treatment..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {requestMethod === "email" ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Open Form
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentRequestDialog;
