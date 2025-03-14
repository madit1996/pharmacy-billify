
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FileUp } from "lucide-react";
import { LabTest } from "@/types/lab-tests";

interface PendingTestsListProps {
  tests: LabTest[];
  onSelectTest: (test: LabTest) => void;
}

const PendingTestsList = ({ tests, onSelectTest }: PendingTestsListProps) => {
  return (
    <div className="overflow-auto max-h-[500px]">
      {tests.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
          <p>No pending tests available</p>
        </div>
      ) : (
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Ordered Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.id}</TableCell>
                <TableCell>{test.patientName}</TableCell>
                <TableCell>{test.testName}</TableCell>
                <TableCell>{format(test.orderedDate, 'MMM d, yyyy')}</TableCell>
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
      )}
    </div>
  );
};

export default PendingTestsList;
