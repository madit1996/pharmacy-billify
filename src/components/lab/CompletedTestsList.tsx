
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabTest } from "@/types/lab-tests";

interface CompletedTestsListProps {
  tests: LabTest[];
}

const CompletedTestsList = ({ tests }: CompletedTestsListProps) => {
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
                      onClick={() => window.open(test.resultUrl, '_blank')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CompletedTestsList;
