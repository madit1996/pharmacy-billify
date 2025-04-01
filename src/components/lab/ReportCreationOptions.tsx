
import { Button } from "@/components/ui/button";
import { FileUp, FileText } from "lucide-react";
import { LabTest } from "@/types/lab-tests";

interface ReportCreationOptionsProps {
  test: LabTest;
  onSelectUpload: () => void;
  onSelectCreate: () => void;
}

const ReportCreationOptions = ({ test, onSelectUpload, onSelectCreate }: ReportCreationOptionsProps) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-900">Test Details</h3>
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="text-gray-500">Patient:</span> {test.patientName}</p>
          <p><span className="text-gray-500">Test:</span> {test.testName}</p>
          <p><span className="text-gray-500">Ordered:</span> {test.orderedDate.toLocaleDateString()}</p>
          <p><span className="text-gray-500">Doctor:</span> {test.doctorName}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">How would you like to create this report?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-6 px-4 justify-start"
            onClick={onSelectUpload}
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FileUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Upload Result File</h4>
                <p className="text-xs text-gray-500 mt-1">Upload a PDF or image of the test results</p>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 px-4 justify-start"
            onClick={onSelectCreate}
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Create Report Form</h4>
                <p className="text-xs text-gray-500 mt-1">Fill out test values in a structured form</p>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportCreationOptions;
