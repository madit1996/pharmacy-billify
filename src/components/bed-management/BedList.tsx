
import { UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BedProps = {
  id: string;
  status: string;
  patientId: number | null;
  patientName: string | null;
  admissionDate: Date | null;
  expectedDischarge: Date | null;
};

type BedListProps = {
  beds: BedProps[];
  onAssignClick: (bed: BedProps) => void;
  onDischargeClick: (wardId: number, bedId: string) => void;
  wardId: number;
};

const BedList = ({ beds, onAssignClick, onDischargeClick, wardId }: BedListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bed ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Patient ID</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead>Expected Discharge</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {beds.map((bed) => (
            <TableRow key={bed.id}>
              <TableCell>{bed.id}</TableCell>
              <TableCell>
                <Badge variant={bed.status === "available" ? "secondary" : "destructive"}>
                  {bed.status === "available" ? "Available" : "Occupied"}
                </Badge>
              </TableCell>
              <TableCell>{bed.patientName || "-"}</TableCell>
              <TableCell>{bed.patientId || "-"}</TableCell>
              <TableCell>{bed.admissionDate ? bed.admissionDate.toLocaleDateString() : "-"}</TableCell>
              <TableCell>{bed.expectedDischarge ? bed.expectedDischarge.toLocaleDateString() : "-"}</TableCell>
              <TableCell>
                {bed.status === "available" ? (
                  <Button size="sm" onClick={() => onAssignClick(bed)}>
                    <UserCheck className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    onClick={() => onDischargeClick(wardId, bed.id)}
                  >
                    Discharge
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BedList;
