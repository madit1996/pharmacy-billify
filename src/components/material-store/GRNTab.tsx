import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, FileText, CheckCircle } from "lucide-react";
import CreateGRNDialog from "./CreateGRNDialog";
import ViewGRNDialog from "./ViewGRNDialog";
import { useToast } from "@/hooks/use-toast";

type GRNRecord = {
  id: string;
  grnNumber: string;
  poNumber: string;
  vendor: string;
  receivedDate: string;
  receivedBy: string;
  totalAmount: number;
  status: "Pending" | "Verified" | "Approved" | "Rejected";
  itemsReceived: number;
  discrepancies: number;
};

const GRNTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const grnRecords: GRNRecord[] = [
    {
      id: "1",
      grnNumber: "GRN2024001",
      poNumber: "PO2024003",
      vendor: "LabEquip India",
      receivedDate: "2024-01-22",
      receivedBy: "Store Manager",
      totalAmount: 95000,
      status: "Verified",
      itemsReceived: 12,
      discrepancies: 0
    },
    {
      id: "2",
      grnNumber: "GRN2024002",
      poNumber: "PO2024001",
      vendor: "MedSupply Corp",
      receivedDate: "2024-01-20",
      receivedBy: "Assistant Manager",
      totalAmount: 118000,
      status: "Pending",
      itemsReceived: 13,
      discrepancies: 2
    }
  ];

  const statuses = ["all", "Pending", "Verified", "Approved", "Rejected"];

  const filteredRecords = grnRecords.filter(record => {
    const matchesSearch = record.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: GRNRecord["status"]) => {
    const statusConfig = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Verified": "bg-blue-100 text-blue-800",
      "Approved": "bg-green-100 text-green-800",
      "Rejected": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const handleVerifyGRN = (grnNumber: string) => {
    toast({
      title: "GRN Verified",
      description: `GRN ${grnNumber} has been verified and approved`,
    });
  };

  const handlePrintGRN = (grnNumber: string) => {
    toast({
      title: "Print GRN",
      description: `Generating PDF for ${grnNumber}`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Goods Receipt Note (GRN) Records</CardTitle>
            <CreateGRNDialog />
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by GRN, PO number, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

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

          {/* GRN Records Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GRN Number</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Received By</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Discrepancies</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.grnNumber}</TableCell>
                    <TableCell>{record.poNumber}</TableCell>
                    <TableCell>{record.vendor}</TableCell>
                    <TableCell>{record.receivedDate}</TableCell>
                    <TableCell>{record.receivedBy}</TableCell>
                    <TableCell>{record.itemsReceived}</TableCell>
                    <TableCell>₹{record.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      {record.discrepancies > 0 ? (
                        <Badge className="bg-red-100 text-red-800">
                          {record.discrepancies}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          None
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <ViewGRNDialog grnNumber={record.grnNumber} />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePrintGRN(record.grnNumber)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {record.status === "Pending" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVerifyGRN(record.grnNumber)}
                          >
                            <CheckCircle className="h-4 w-4" />
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

export default GRNTab;
