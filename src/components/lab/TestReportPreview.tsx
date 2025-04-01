
import { useState } from "react";
import { LabTest } from "@/types/lab-tests";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mail, Printer, Share2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TestPatientInfo from "./TestPatientInfo";
import { getTestTemplate } from "@/types/test-templates";

interface TestReportPreviewProps {
  test: LabTest;
  reportData: Record<string, any>;
  onEdit: () => void;
  onClose: () => void;
}

const TestReportPreview = ({ 
  test, 
  reportData, 
  onEdit, 
  onClose 
}: TestReportPreviewProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { toast } = useToast();
  const template = getTestTemplate(test.testName);

  const handlePrint = () => {
    toast({
      title: "Printing report",
      description: "Sending report to printer..."
    });
    
    // In a real app, we would use window.print() or a print library
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleEmail = () => {
    toast({
      title: "Email sent",
      description: `Report sent to patient's email address.`
    });
    setIsShareDialogOpen(false);
  };

  const handleWhatsApp = () => {
    toast({
      title: "WhatsApp sharing",
      description: "Report shared via WhatsApp."
    });
    setIsShareDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Report header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Laboratory Test Report</h2>
          <p className="text-gray-500">Report generated on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-1" size={16} /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1" size={16} /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsShareDialogOpen(true)}>
            <Share2 className="mr-1" size={16} /> Share
          </Button>
        </div>
      </div>

      {/* Patient information */}
      <TestPatientInfo test={test} />

      {/* Report details */}
      <div className="bg-white p-6 border rounded-md shadow-sm">
        <h3 className="text-lg font-medium mb-4">Test Results</h3>
        
        <div className="space-y-6">
          <div className="space-y-4">
            {template.fields.map((field) => (
              <div key={field.name} className="grid grid-cols-3 gap-2 border-b pb-2">
                <div className="font-medium">{field.label}</div>
                <div>
                  {reportData[field.name] || "-"}
                  {field.unit && <span className="text-gray-500 ml-1">{field.unit}</span>}
                </div>
                {field.reference && (
                  <div className="text-sm text-gray-500">
                    Ref: {field.reference}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Sections */}
          {template.sections && template.sections.map((section) => (
            <div key={section.name} className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">{section.displayName}</h4>
              <div className="space-y-2">
                {section.fields.map((field) => (
                  <div key={field.name} className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="font-medium">{field.label}</div>
                    <div>
                      {reportData[field.name] || "-"}
                      {field.unit && <span className="text-gray-500 ml-1">{field.unit}</span>}
                    </div>
                    {field.reference && (
                      <div className="text-sm text-gray-500">
                        Ref: {field.reference}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Dialog */}
      <AlertDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Test Report</AlertDialogTitle>
            <AlertDialogDescription>
              Select how you would like to share this report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              onClick={handleEmail}
            >
              <Mail className="mr-2" size={18} /> Share via Email
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              onClick={handleWhatsApp}
            >
              <Share2 className="mr-2" size={18} /> Share via WhatsApp
            </Button>
          </div>
          <AlertDialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsShareDialogOpen(false)}
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestReportPreview;
