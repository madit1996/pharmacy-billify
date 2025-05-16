
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
import { Plus, Edit, Trash2, Filter } from "lucide-react";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { BloodRequest } from "@/types/blood-bank";
import BloodRequestDialog from "./BloodRequestDialog";

const BloodRequestsTab = () => {
  const { requests, updateRequest, deleteRequest } = useBloodBankContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleAddNew = () => {
    setSelectedRequest(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (request: BloodRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      deleteRequest(id);
    }
  };

  const handleFulfill = (request: BloodRequest) => {
    updateRequest({
      ...request,
      status: 'fulfilled'
    });
  };

  const handleCancel = (request: BloodRequest) => {
    updateRequest({
      ...request,
      status: 'cancelled'
    });
  };

  const filteredRequests = statusFilter 
    ? requests.filter(request => request.status === statusFilter)
    : requests;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Blood Requests</h2>
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
              className={`${statusFilter === 'pending' ? 'bg-yellow-100' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${statusFilter === 'fulfilled' ? 'bg-green-100' : ''}`}
              onClick={() => setStatusFilter('fulfilled')}
            >
              Fulfilled
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${statusFilter === 'cancelled' ? 'bg-red-100' : ''}`}
              onClick={() => setStatusFilter('cancelled')}
            >
              Cancelled
            </Button>
          </div>
          <Button
            onClick={handleAddNew}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="bg-white rounded border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Required Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.patientName}
                    <div className="text-xs text-gray-500">ID: {request.patientId}</div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-red-100 text-red-800 rounded-full px-3 py-1">
                      {request.bloodGroup}
                    </span>
                  </TableCell>
                  <TableCell>{request.quantity} units</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{request.requiredDate}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${request.priority === 'emergency' ? 'bg-red-100 text-red-800' : 
                          request.priority === 'urgent' ? 'bg-orange-100 text-orange-800' : 
                          'bg-blue-100 text-blue-800'}`}
                    >
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          request.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleFulfill(request)}
                          >
                            Fulfill
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleCancel(request)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(request)}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(request.id)}
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
        <BloodRequestDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          bloodRequest={selectedRequest}
        />
      )}
    </div>
  );
};

export default BloodRequestsTab;
