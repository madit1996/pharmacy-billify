import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CertificateRequestDialog from "./CertificateRequestDialog";
import ViewDetailsDialog from "../shared/ViewDetailsDialog";
import QuickCertificateGenerator from "./QuickCertificateGenerator";

type CertificateRequest = {
  id: string;
  requestId: string;
  type: "Birth" | "Death" | "Medical Fitness" | "Discharge Summary";
  patientName: string;
  requestedBy: string;
  requestDate: string;
  requiredDate: string;
  status: "Pending" | "In Progress" | "Ready" | "Delivered";
  fees: number;
  paymentStatus: "Paid" | "Pending";
};

const CertificateRequestsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const certificateRequests: CertificateRequest[] = [
    {
      id: "1",
      requestId: "CERT001",
      type: "Birth",
      patientName: "Baby John",
      requestedBy: "John Doe",
      requestDate: "2024-01-15",
      requiredDate: "2024-01-20",
      status: "Ready",
      fees: 500,
      paymentStatus: "Paid"
    },
    {
      id: "2",
      requestId: "CERT002",
      type: "Death",
      patientName: "Mary Wilson",
      requestedBy: "Robert Wilson",
      requestDate: "2024-01-16",
      requiredDate: "2024-01-18",
      status: "In Progress",
      fees: 300,
      paymentStatus: "Paid"
    },
    {
      id: "3",
      requestId: "CERT003",
      type: "Medical Fitness",
      patientName: "Sarah Johnson",
      requestedBy: "Sarah Johnson",
      requestDate: "2024-01-17",
      requiredDate: "2024-01-25",
      status: "Pending",
      fees: 200,
      paymentStatus: "Pending"
    }
  ];

  const types = ["all", "Birth", "Death", "Medical Fitness", "Discharge Summary"];
  const statuses = ["all", "Pending", "In Progress", "Ready", "Delivered"];

  const filteredRequests = certificateRequests.filter(request => {
    const matchesSearch = request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: CertificateRequest["status"]) => {
    const statusConfig = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      "Ready": "bg-green-100 text-green-800",
      "Delivered": "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: CertificateRequest["paymentStatus"]) => {
    const statusConfig = {
      "Paid": "bg-green-100 text-green-800",
      "Pending": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const handleDownload = (requestId: string) => {
    toast({
      title: "Download Started",
      description: `Certificate ${requestId} is being downloaded.`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Certificate Requests</CardTitle>
            <CertificateRequestDialog />
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by request ID or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Requests Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Required Date</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.requestId}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.patientName}</TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{request.requiredDate}</TableCell>
                    <TableCell>₹{request.fees}</TableCell>
                    <TableCell>{getPaymentBadge(request.paymentStatus)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <ViewDetailsDialog
                          title={`Certificate Request - ${request.requestId}`}
                          data={{
                            "Request ID": request.requestId,
                            "Type": request.type,
                            "Patient Name": request.patientName,
                            "Requested By": request.requestedBy,
                            "Request Date": request.requestDate,
                            "Required Date": request.requiredDate,
                            "Fees": `₹${request.fees}`,
                            "Payment Status": request.paymentStatus,
                            "Status": request.status
                          }}
                          downloadable={request.status === "Ready"}
                        />
                        <QuickCertificateGenerator
                          requestId={request.requestId}
                          type={request.type}
                          patientName={request.patientName}
                        />
                        {request.status === "Ready" && (
                          <Button variant="outline" size="sm" onClick={() => handleDownload(request.requestId)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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

export default CertificateRequestsTab;
