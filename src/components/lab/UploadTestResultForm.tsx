
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabTest } from "@/types/lab-tests";
import ReportCreationOptions from "./ReportCreationOptions";
import TestReportForm from "./TestReportForm";
import TestPatientInfo from "./TestPatientInfo";
import { ArrowLeft, PlusCircle } from "lucide-react";

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
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };
  
  const handleSupportingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSupportingFiles(prev => [...prev, files[0]]);
    }
  };
  
  const handleRemoveSupportingFile = (index: number) => {
    setSupportingFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = () => {
    if (file) {
      onUpload(test.id, file);
      setDialogOpen(false);
    }
  };
  
  const handleCreateReport = (testId: string, reportData: Record<string, any>) => {
    if (onCreateReport) {
      // Add supporting files info to reportData
      const filesInfo = supportingFiles.map(f => ({ name: f.name, size: f.size }));
      const enhancedReportData = { ...reportData, supportingFiles: filesInfo };
      
      onCreateReport(testId, enhancedReportData);
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

  const handleBackToOptions = () => {
    setStep('options');
  };
  
  // If test is not in reporting status, show appropriate message
  if (test.status !== 'reporting' && test.status !== 'completed') {
    return (
      <div className="p-6 space-y-4">
        <TestPatientInfo test={test} />
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="font-medium text-yellow-800">Test not ready for reporting</h3>
          <p className="text-sm text-yellow-700 mt-1">
            This test is currently in the "{test.status}" phase. 
            Test results can only be uploaded once it reaches the reporting phase.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onCancel}>
            Back
          </Button>
        </div>
      </div>
    );
  }
  
  // For options selection screen (only when test is in reporting status)
  return (
    <>
      <div className="mb-5">
        <TestPatientInfo test={test} />
      </div>
      
      {step === 'options' ? (
        <ReportCreationOptions
          test={test}
          onSelectUpload={() => handleOpenDialog('upload')}
          onSelectCreate={() => handleOpenDialog('create')}
        />
      ) : (
        <div className="mb-4">
          <Button variant="ghost" onClick={handleBackToOptions} className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to options
          </Button>
        </div>
      )}
      
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
            <div className="space-y-4">
              <div className="mb-6 border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Supporting Files</h3>
                
                <div className="space-y-3">
                  {supportingFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveSupportingFile(index)}
                        className="text-red-500 h-8 px-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <Label 
                      htmlFor="supporting-file" 
                      className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      <span>Add supporting file</span>
                      <Input
                        id="supporting-file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                        onChange={handleSupportingFileChange}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              </div>
              
              <TestReportForm 
                test={test} 
                onSubmit={handleCreateReport} 
                onCancel={handleCloseDialog}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadTestResultForm;
