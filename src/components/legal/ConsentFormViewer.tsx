
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsentFormViewerProps {
  formId: string;
  consentType: string;
  patientName: string;
  status: string;
}

const ConsentFormViewer = ({ formId, consentType, patientName, status }: ConsentFormViewerProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const consentFormContent = {
    header: `${consentType} Consent Form`,
    patient: patientName,
    content: `I, ${patientName}, understand that I am giving consent for ${consentType.toLowerCase()}. I have been informed of the risks, benefits, and alternatives. I understand that no guarantee has been made regarding the outcome.`,
    risks: [
      "Bleeding and infection",
      "Allergic reactions to medications",
      "Unforeseen complications",
      "Need for additional procedures"
    ],
    alternatives: [
      "Conservative treatment",
      "Alternative medications", 
      "No treatment (risks explained)"
    ]
  };

  const handleDownload = () => {
    toast({
      title: "Form Downloaded",
      description: `Consent form ${formId} has been downloaded.`,
    });
  };

  const handleUpdateStatus = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Consent form status updated to ${newStatus}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{consentFormContent.header}</span>
            <Badge className={status === "Obtained" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
              {status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Patient Information</h3>
            <p><strong>Patient:</strong> {consentFormContent.patient}</p>
            <p><strong>Form ID:</strong> {formId}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Consent Statement</h3>
            <p className="text-gray-700 leading-relaxed">{consentFormContent.content}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Risks and Complications</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {consentFormContent.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Alternatives Discussed</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {consentFormContent.alternatives.map((alt, index) => (
                <li key={index}>{alt}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Signatures</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-3 rounded">
                <p className="text-sm text-gray-600">Patient/Guardian Signature</p>
                <div className="h-16 border-b border-gray-300 mt-2"></div>
                <p className="text-xs text-gray-500 mt-1">Date: ___________</p>
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm text-gray-600">Witness Signature</p>
                <div className="h-16 border-b border-gray-300 mt-2"></div>
                <p className="text-xs text-gray-500 mt-1">Date: ___________</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <div className="space-x-2">
              {status === "Pending" && (
                <>
                  <Button onClick={() => handleUpdateStatus("Obtained")} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Obtained
                  </Button>
                  <Button onClick={() => handleUpdateStatus("Refused")} variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Mark Refused
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentFormViewer;
