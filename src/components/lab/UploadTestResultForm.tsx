
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };
  
  const handleUpload = () => {
    if (file) {
      onUpload(test.id, file);
    }
  };
  
  const handleCreateReport = (testId: string, reportData: Record<string, any>) => {
    if (onCreateReport) {
      onCreateReport(testId, reportData);
    }
  };
  
  // For options selection screen
  if (step === 'options') {
    return (
      <ReportCreationOptions
        test={test}
        onSelectUpload={() => setStep('upload')}
        onSelectCreate={() => setStep('create')}
      />
    );
  }
  
  // For file upload screen
  if (step === 'upload') {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Upload Test Result</h3>
          <p className="text-sm text-muted-foreground">
            Upload the test result for {test.patientName}'s {test.testName}
          </p>
        </div>
        
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="result-file">Result File</Label>
          <Input
            id="result-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setStep('options')}>
            Back
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file}
          >
            Upload Result
          </Button>
        </div>
      </div>
    );
  }
  
  // For report creation screen
  return (
    <TestReportForm 
      test={test} 
      onSubmit={handleCreateReport} 
      onCancel={() => setStep('options')}
    />
  );
};

export default UploadTestResultForm;
