
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickCertificateGeneratorProps {
  requestId: string;
  type: string;
  patientName: string;
}

const QuickCertificateGenerator = ({ requestId, type, patientName }: QuickCertificateGeneratorProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [certificateData, setCertificateData] = useState({
    issuedBy: "",
    remarks: "",
    validityPeriod: ""
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Certificate Generated",
      description: `${type} certificate for ${patientName} has been generated and is ready for download.`,
    });
    setOpen(false);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Certificate ${requestId} is being downloaded.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-1" />
          Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate {type} Certificate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <Label>Patient Name</Label>
            <Input value={patientName} disabled />
          </div>

          <div>
            <Label htmlFor="issuedBy">Issued By</Label>
            <Input
              id="issuedBy"
              value={certificateData.issuedBy}
              onChange={(e) => setCertificateData({...certificateData, issuedBy: e.target.value})}
              placeholder="Dr. Name / Department"
              required
            />
          </div>

          <div>
            <Label htmlFor="validityPeriod">Validity Period</Label>
            <Input
              id="validityPeriod"
              value={certificateData.validityPeriod}
              onChange={(e) => setCertificateData({...certificateData, validityPeriod: e.target.value})}
              placeholder="e.g., 6 months, Permanent"
            />
          </div>

          <div>
            <Label htmlFor="remarks">Additional Remarks</Label>
            <Textarea
              id="remarks"
              value={certificateData.remarks}
              onChange={(e) => setCertificateData({...certificateData, remarks: e.target.value})}
              rows={3}
              placeholder="Any additional information..."
            />
          </div>

          <div className="flex justify-between space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <div className="flex space-x-2">
              <Button type="submit">Generate</Button>
              <Button type="button" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCertificateGenerator;
