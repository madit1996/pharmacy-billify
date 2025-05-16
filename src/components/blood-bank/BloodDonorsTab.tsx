
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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { BloodDonor } from "@/types/blood-bank";
import BloodDonorDialog from "./BloodDonorDialog";

const BloodDonorsTab = () => {
  const { donors, deleteDonor } = useBloodBankContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);

  const handleAddNew = () => {
    setSelectedDonor(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (donor: BloodDonor) => {
    setSelectedDonor(donor);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this donor?")) {
      deleteDonor(id);
    }
  };

  const filteredDonors = donors.filter(donor => 
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.bloodGroup.includes(searchTerm.toUpperCase()) ||
    (donor.email && donor.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Blood Donors</h2>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Add New Donor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search donors by name, blood group, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Donation</TableHead>
              <TableHead>Eligible From</TableHead>
              <TableHead>Donations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No donors found
                </TableCell>
              </TableRow>
            ) : (
              filteredDonors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell className="font-medium">{donor.name}</TableCell>
                  <TableCell>
                    <span className="bg-red-100 text-red-800 rounded-full px-3 py-1">
                      {donor.bloodGroup}
                    </span>
                  </TableCell>
                  <TableCell>
                    {donor.contactNumber}
                    {donor.email && (
                      <div className="text-xs text-gray-500">{donor.email}</div>
                    )}
                  </TableCell>
                  <TableCell>{donor.lastDonationDate || "N/A"}</TableCell>
                  <TableCell>{donor.eligibleDate || "N/A"}</TableCell>
                  <TableCell>{donor.donationCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(donor)}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(donor.id)}
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
        <BloodDonorDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          donor={selectedDonor}
        />
      )}
    </div>
  );
};

export default BloodDonorsTab;
