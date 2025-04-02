
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FileUp } from "lucide-react";
import { LabTest } from "@/types/lab-tests";
import { Badge } from "@/components/ui/badge";

interface PendingTestsListProps {
  tests: LabTest[];
  onSelectTest: (test: LabTest) => void;
}

const PendingTestsList = ({ tests, onSelectTest }: PendingTestsListProps) => {
  // Group tests by billId
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
          <p>No pending tests available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTests).map(([billKey, billTests]) => {
            const patientGroups = groupTestsByPatient(billTests);
            
            return (
              <div key={billKey} className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {billKey !== 'single' ? (
                        <>
                          Bill #<span className="text-blue-600">{billKey}</span>
                        </>
                      ) : 'Single Tests'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {Object.keys(patientGroups).length} patient{Object.keys(patientGroups).length > 1 ? 's' : ''} • {billTests.length} test{billTests.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {format(billTests[0].orderedDate, 'MMM d, yyyy')}
                  </Badge>
                </div>
                
                {/* Display each patient group within this bill */}
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
                          <TableHead>Category</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientTests.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.id}</TableCell>
                            <TableCell>{test.testName}</TableCell>
                            <TableCell className="capitalize">{test.category || 'general'}</TableCell>
                            <TableCell>{test.doctorName}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSelectTest(test)}
                              >
                                <FileUp className="mr-2 h-4 w-4" />
                                Upload
                              </Button>
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
    </div>
  );
};

export default PendingTestsList;
