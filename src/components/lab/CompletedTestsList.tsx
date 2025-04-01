
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

  return (
    <div className="overflow-auto max-h-[500px]">
      {tests.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
          <p>No completed tests available</p>
        </div>
      ) : (
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Completed Date</TableHead>
              <TableHead className="text-right">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.id}</TableCell>
                <TableCell>{test.patientName}</TableCell>
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
