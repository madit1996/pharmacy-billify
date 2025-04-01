
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabTest } from "@/types/lab-tests";
import ReportCreationOptions from "./ReportCreationOptions";
import TestReportForm from "./TestReportForm";

interface UploadTestResultFormProps {
  test: LabTest;
  onUpload: (testId: string, resultFile: File) => void;
  onCreateReport?: (testId: string, reportData: Record<string, any>) => void;
  onCancel: () => void;
}

const UploadTestResultForm = ({ 
  test, 
  onUpload, 
  onCreateReport, 
  onCancel 
}: UploadTestResultFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'options' | 'upload' | 'create'>('options');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };
  
  const handleUpload = () => {
    if (file) {
      onUpload(test.id, file);
      setDialogOpen(false);
    }
  };
  
  const handleCreateReport = (testId: string, reportData: Record<string, any>) => {
    if (onCreateReport) {
      onCreateReport(testId, reportData);
      setDialogOpen(false);
    }
  };

  const handleOpenDialog = (selectedStep: 'upload' | 'create') => {
    setStep(selectedStep);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Reset to options after closing dialog
    setTimeout(() => setStep('options'), 300);
  };
  
  // For options selection screen
  return (
    <>
      <ReportCreationOptions
        test={test}
        onSelectUpload={() => handleOpenDialog('upload')}
        onSelectCreate={() => handleOpenDialog('create')}
      />
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {step === 'upload' ? 'Upload Test Result' : 'Create Test Report'}
            </DialogTitle>
          </DialogHeader>
          
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="result-file">Upload Result File</Label>
                <Input
                  id="result-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file}
                >
                  Upload Result
                </Button>
              </div>
            </div>
          )}
          
          {step === 'create' && (
            <TestReportForm 
              test={test} 
              onSubmit={handleCreateReport} 
              onCancel={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadTestResultForm;
