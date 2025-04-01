
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LabTest } from "@/types/lab-tests";
import { Mail, Printer, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TestPatientInfo from "./TestPatientInfo";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TestResultViewerProps {
  test: LabTest;
  open: boolean;
  onClose: () => void;
}

const TestResultViewer = ({ test, open, onClose }: TestResultViewerProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { toast } = useToast();

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
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Test Report</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Report header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{test.testName} Report</h2>
                <p className="text-gray-500">
                  Report completed on {test.completedDate?.toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
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
            
            {/* If we have a result URL, show it */}
            {test.resultUrl && (
              <div className="bg-white p-6 border rounded-md shadow-sm">
                <h3 className="text-lg font-medium mb-4">Test Results</h3>
                <div className="flex justify-center">
                  {test.resultUrl.endsWith('.pdf') ? (
                    <iframe 
                      src={test.resultUrl} 
                      className="w-full h-[500px]" 
                      title="Test Result PDF"
                    />
                  ) : (
                    <img 
                      src={test.resultUrl} 
                      alt="Test Result" 
                      className="max-h-[500px] object-contain" 
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default TestResultViewer;
