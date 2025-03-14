
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Upload, X } from "lucide-react";
import { LabTest } from "@/types/lab-tests";

interface UploadTestResultFormProps {
  test: LabTest;
  onUpload: (testId: string, file: File) => void;
  onCancel: () => void;
}

const UploadTestResultForm = ({ test, onUpload, onCancel }: UploadTestResultFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload(test.id, selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Test ID</Label>
        <div className="p-2 bg-gray-50 rounded-md text-sm">{test.id}</div>
      </div>
      
      <div className="space-y-1">
        <Label>Patient</Label>
        <div className="p-2 bg-gray-50 rounded-md text-sm">{test.patientName}</div>
      </div>
      
      <div className="space-y-1">
        <Label>Test</Label>
        <div className="p-2 bg-gray-50 rounded-md text-sm">{test.testName}</div>
      </div>
      
      <div className="space-y-1">
        <Label>Ordered Date</Label>
        <div className="p-2 bg-gray-50 rounded-md text-sm">
          {format(test.orderedDate, 'MMM d, yyyy')}
        </div>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="result-file">Test Result File</Label>
        <Input 
          id="result-file" 
          type="file" 
          onChange={handleFileChange}
          accept=".pdf,.jpg,.png,.docx"
        />
        {selectedFile && (
          <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md flex items-center justify-between">
            <span className="text-sm truncate">{selectedFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea 
          id="notes" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes or comments"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!selectedFile}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Result
        </Button>
      </div>
    </form>
  );
};

export default UploadTestResultForm;
