
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { BloodDonationCamp } from "@/types/blood-bank";
import BloodDonationCampDialog from "./BloodDonationCampDialog";

const BloodDonationCampTab = () => {
  const { camps, deleteCamp } = useBloodBankContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<BloodDonationCamp | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleAddNew = () => {
    setSelectedCamp(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (camp: BloodDonationCamp) => {
    setSelectedCamp(camp);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this camp?")) {
      deleteCamp(id);
    }
  };

  const filteredCamps = statusFilter 
    ? camps.filter(camp => camp.status === statusFilter)
    : camps;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Blood Donation Camps</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <Button
              variant="outline"
              size="sm"
              className={`${statusFilter === null ? 'bg-gray-100' : ''}`}
              onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${statusFilter === 'scheduled' ? 'bg-blue-100' : ''}`}
              onClick={() => setStatusFilter('scheduled')}
            >
              Scheduled
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${statusFilter === 'ongoing' ? 'bg-green-100' : ''}`}
              onClick={() => setStatusFilter('ongoing')}
            >
              Ongoing
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${statusFilter === 'completed' ? 'bg-gray-100' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>
          <Button
            onClick={handleAddNew}
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Organize New Camp
          </Button>
        </div>
      </div>

      <div className="bg-white rounded border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Camp Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Expected Donors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCamps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No donation camps found
                </TableCell>
              </TableRow>
            ) : (
              filteredCamps.map((camp) => (
                <TableRow key={camp.id}>
                  <TableCell className="font-medium">
                    {camp.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span>{camp.location}</span>
                    </div>
                    <div className="text-xs text-gray-500">{camp.address}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span>{camp.startDate}</span>
                    </div>
                    {camp.startDate !== camp.endDate && (
                      <div className="text-xs text-gray-500">to {camp.endDate}</div>
                    )}
                  </TableCell>
                  <TableCell>{camp.organizer}</TableCell>
                  <TableCell>
                    <div>{camp.contactPerson}</div>
                    <div className="text-xs text-gray-500">{camp.contactNumber}</div>
                  </TableCell>
                  <TableCell>
                    {camp.expectedDonors}
                    {camp.actualDonors !== undefined && (
                      <div className="text-xs text-gray-500">
                        Actual: {camp.actualDonors}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${camp.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                          camp.status === 'ongoing' ? 'bg-green-100 text-green-800' : 
                          camp.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'}`}
                    >
                      {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(camp)}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(camp.id)}
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
        <BloodDonationCampDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          camp={selectedCamp}
        />
      )}
    </div>
  );
};

export default BloodDonationCampTab;
