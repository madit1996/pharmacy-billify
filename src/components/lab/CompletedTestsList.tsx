
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabTest } from "@/types/lab-tests";
import TestResultViewer from "./TestResultViewer";

interface CompletedTestsListProps {
  tests: LabTest[];
}

const CompletedTestsList = ({ tests }: CompletedTestsListProps) => {
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleViewResult = (test: LabTest) => {
    setSelectedTest(test);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    // Clear the selected test with a slight delay to avoid UI flicker
    setTimeout(() => setSelectedTest(null), 300);
  };

  // Group tests by billId for better organization
  const groupedTests: Record<string, LabTest[]> = {};
  
  tests.forEach(test => {
    const billKey = test.billId || 'single';
    if (!groupedTests[billKey]) {
      groupedTests[billKey] = [];
    }
    groupedTests[billKey].push(test);
  });
  
  // Further group tests by patient within each bill
  const groupTestsByPatient = (tests: LabTest[]): Record<string, LabTest[]> => {
    const patientGroups: Record<string, LabTest[]> = {};
    
    tests.forEach(test => {
      const patientKey = test.patientId;
      if (!patientGroups[patientKey]) {
        patientGroups[patientKey] = [];
      }
      patientGroups[patientKey].push(test);
    });
    
    return patientGroups;
  };

  return (
    <div className="overflow-auto max-h-[500px]">
      {tests.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
          <p>No completed tests available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTests).map(([billKey, billTests]) => {
            const patientGroups = groupTestsByPatient(billTests);
            
            return (
              <div key={billKey} className="border rounded-md overflow-hidden">
                {billKey !== 'single' && (
                  <div className="bg-gray-50 p-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        Bill #<span className="text-blue-600">{billKey}</span>
                      </h3>
                      <p className="text-sm text-gray-500">
                        {Object.keys(patientGroups).length} patient{Object.keys(patientGroups).length > 1 ? 's' : ''} • {billTests.length} test{billTests.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
                
                {Object.entries(patientGroups).map(([patientId, patientTests]) => (
                  <div key={patientId} className="border-t">
                    <div className="bg-gray-50/50 px-4 py-2">
                      <h4 className="font-medium text-sm">
                        Patient: {patientTests[0].patientName}
                      </h4>
                    </div>
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Test</TableHead>
                          <TableHead>Completed Date</TableHead>
                          <TableHead className="text-right">Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientTests.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.id}</TableCell>
                            <TableCell>{test.testName}</TableCell>
                            <TableCell>
                              {test.completedDate && format(test.completedDate, 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              {test.resultUrl && (
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600"
                                  onClick={() => handleViewResult(test)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {selectedTest && (
        <TestResultViewer
          test={selectedTest}
          open={previewOpen}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default CompletedTestsList;
