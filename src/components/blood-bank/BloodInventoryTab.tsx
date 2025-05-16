
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Filter } from "lucide-react";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { BloodUnit, BloodGroup } from "@/types/blood-bank";
import BloodUnitDialog from "./BloodUnitDialog";

const BloodInventoryTab = () => {
  const { bloodUnits, updateBloodUnit, deleteBloodUnit } = useBloodBankContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BloodUnit | null>(null);
  const [filter, setFilter] = useState<{ bloodGroup?: BloodGroup, status?: string }>({});

  const handleAddNew = () => {
    setSelectedUnit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (unit: BloodUnit) => {
    setSelectedUnit(unit);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blood unit?")) {
      deleteBloodUnit(id);
    }
  };

  const filteredUnits = bloodUnits.filter(unit => {
    if (filter.bloodGroup && unit.bloodGroup !== filter.bloodGroup) return false;
    if (filter.status && unit.status !== filter.status) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Blood Inventory</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setFilter({})}
          >
            <Filter className="h-4 w-4" />
            {Object.keys(filter).length > 0 ? "Clear Filters" : "Filter"}
          </Button>
          <Button
            onClick={handleAddNew}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Add Blood Unit
          </Button>
        </div>
      </div>

      <div className="bg-white rounded border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Blood Group</TableHead>
              <TableHead>Donation Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Volume (ml)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No blood units found
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-semibold">
                    <span className="bg-red-100 text-red-800 rounded-full px-3 py-1">
                      {unit.bloodGroup}
                    </span>
                  </TableCell>
                  <TableCell>{unit.donationDate}</TableCell>
                  <TableCell>{unit.expiryDate}</TableCell>
                  <TableCell>{unit.volume} ml</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${unit.status === 'available' ? 'bg-green-100 text-green-800' : 
                          unit.status === 'reserved' ? 'bg-blue-100 text-blue-800' : 
                          unit.status === 'used' ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'}`}
                    >
                      {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{unit.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(unit)}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(unit.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isDialogOpen && (
        <BloodUnitDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          bloodUnit={selectedUnit}
        />
      )}
    </div>
  );
};

export default BloodInventoryTab;
