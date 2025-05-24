
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";

type LeaveStatus = "Pending" | "Approved" | "Rejected";
type LeaveType = "Sick Leave" | "Casual Leave" | "Earned Leave" | "Maternity Leave" | "Emergency Leave";

type LeaveRequest = {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  appliedDate: string;
  status: LeaveStatus;
  approvedBy?: string;
  comments?: string;
};

const LeaveApprovalsTab = () => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [approvalComments, setApprovalComments] = useState("");

  const leaveRequests: LeaveRequest[] = [
    {
      id: "LR001",
      staffId: "EMP001",
      staffName: "Dr. Sarah Johnson",
      department: "Cardiology",
      leaveType: "Sick Leave",
      fromDate: "2024-01-15",
      toDate: "2024-01-17",
      days: 3,
      reason: "Fever and cold symptoms",
      appliedDate: "2024-01-12",
      status: "Pending"
    },
    {
      id: "LR002",
      staffId: "EMP002",
      staffName: "Nurse Mary Wilson",
      department: "Emergency",
      leaveType: "Casual Leave",
      fromDate: "2024-01-20",
      toDate: "2024-01-22",
      days: 3,
      reason: "Family function",
      appliedDate: "2024-01-10",
      status: "Approved",
      approvedBy: "HR Manager",
      comments: "Approved - sufficient leave balance"
    },
    {
      id: "LR003",
      staffId: "EMP003",
      staffName: "Dr. Michael Brown",
      department: "Orthopedics",
      leaveType: "Earned Leave",
      fromDate: "2024-02-01",
      toDate: "2024-02-07",
      days: 7,
      reason: "Vacation with family",
      appliedDate: "2024-01-05",
      status: "Pending"
    },
    {
      id: "LR004",
      staffId: "EMP004",
      staffName: "Technician John Smith",
      department: "Radiology",
      leaveType: "Emergency Leave",
      fromDate: "2024-01-14",
      toDate: "2024-01-14",
      days: 1,
      reason: "Medical emergency in family",
      appliedDate: "2024-01-14",
      status: "Rejected",
      approvedBy: "Department Head",
      comments: "Insufficient documentation provided"
    }
  ];

  const filteredRequests = leaveRequests.filter(request => 
    filterStatus === "all" || request.status === filterStatus
  );

  const getStatusBadge = (status: LeaveStatus) => {
    const statusConfig = {
      "Pending": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Approved": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "Rejected": { color: "bg-red-100 text-red-800", icon: XCircle }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const handleApproval = (requestId: string, action: "approve" | "reject") => {
    console.log(`${action} leave request ${requestId} with comments: ${approvalComments}`);
    setApprovalComments("");
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Leave Requests</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>From Date</TableHead>
                  <TableHead>To Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.staffName}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>{format(new Date(request.fromDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(request.toDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>{format(new Date(request.appliedDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Leave Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Staff Name</label>
                                  <p className="text-sm">{selectedRequest.staffName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Department</label>
                                  <p className="text-sm">{selectedRequest.department}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Leave Type</label>
                                  <p className="text-sm">{selectedRequest.leaveType}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Duration</label>
                                  <p className="text-sm">{selectedRequest.days} days</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Reason</label>
                                <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{selectedRequest.reason}</p>
                              </div>

                              {selectedRequest.status === "Pending" && (
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium">Comments</label>
                                    <Textarea
                                      placeholder="Add approval/rejection comments..."
                                      value={approvalComments}
                                      onChange={(e) => setApprovalComments(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => handleApproval(selectedRequest.id, "approve")}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      onClick={() => handleApproval(selectedRequest.id, "reject")}
                                      variant="destructive"
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedRequest.status !== "Pending" && selectedRequest.comments && (
                                <div>
                                  <label className="text-sm font-medium">Comments</label>
                                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{selectedRequest.comments}</p>
                                  <p className="text-xs text-gray-500 mt-1">Approved by: {selectedRequest.approvedBy}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveApprovalsTab;
