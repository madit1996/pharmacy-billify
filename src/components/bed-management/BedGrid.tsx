
import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BedProps = {
  id: string;
  status: string;
  patientId: number | null;
  patientName: string | null;
  admissionDate: Date | null;
  expectedDischarge: Date | null;
};

type BedGridProps = {
  beds: BedProps[];
  onBedClick: (bed: BedProps) => void;
  onAssignClick: (bed: BedProps) => void;
  onDischargeClick: (wardId: number, bedId: string) => void;
  wardId: number;
};

const BedGrid = ({ beds, onBedClick, onAssignClick, onDischargeClick, wardId }: BedGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {beds.map((bed) => (
        <div
          key={bed.id}
          className={`border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors ${
            bed.status === "available" ? "bg-green-50" : "bg-red-50"
          }`}
          onClick={() => onBedClick(bed)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">{bed.id}</div>
            {bed.status === "available" ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-red-600" />
            )}
          </div>
          
          {bed.status === "occupied" && (
            <div className="mt-2 text-sm">
              <div className="font-medium truncate">{bed.patientName}</div>
              <div className="text-gray-500 text-xs">
                ID: {bed.patientId}
              </div>
              <div className="text-gray-500 text-xs">
                Admitted: {bed.admissionDate?.toLocaleDateString()}
              </div>
            </div>
          )}
          
          {bed.status === "available" && (
            <div className="mt-3 flex items-center justify-center">
              <Button size="sm" className="w-full" onClick={(e) => {
                e.stopPropagation();
                onAssignClick(bed);
              }}>
                <Plus className="h-3 w-3 mr-1" />
                Assign
              </Button>
            </div>
          )}
          
          {bed.status === "occupied" && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-red-600 hover:text-red-800 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDischargeClick(wardId, bed.id);
                }}
              >
                Discharge
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BedGrid;
