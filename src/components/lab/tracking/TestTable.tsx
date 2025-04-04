
import { LabTest, LabTestStatus } from "@/types/lab-tests";
import { User } from "lucide-react";
import TestCard from "./TestCard";

interface TestTableProps {
  tests: LabTest[];
  onSelectTest: (test: LabTest) => void;
  onUpdateWorkflow: (test: LabTest, newStatus: LabTestStatus, notes?: string) => void;
}

const TestTable = ({ tests, onSelectTest, onUpdateWorkflow }: TestTableProps) => {
  if (tests.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No tests match the selected filters
      </div>
    );
  }
  
  // Group tests by patient for better organization
  const testsByPatient: Record<string, LabTest[]> = {};
  tests.forEach(test => {
    if (!testsByPatient[test.patientId]) {
      testsByPatient[test.patientId] = [];
    }
    testsByPatient[test.patientId].push(test);
  });
  
  return (
    <div className="divide-y">
      {Object.entries(testsByPatient).map(([patientId, patientTests]) => (
        <div key={patientId} className="p-4">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="font-medium">{patientTests[0].patientName}</h3>
          </div>
          
          <div className="space-y-4">
            {patientTests.map(test => (
              <TestCard 
                key={test.id}
                test={test} 
                onSelectTest={onSelectTest}
                onUpdateWorkflow={onUpdateWorkflow}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestTable;
