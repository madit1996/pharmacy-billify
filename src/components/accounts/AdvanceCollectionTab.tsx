import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdvanceCollectionDialog from "./AdvanceCollectionDialog";
import ViewDetailsDialog from "../shared/ViewDetailsDialog";

type AdvanceRecord = {
  id: string;
  receiptNumber: string;
  patientName: string;
  amount: number;
  type: "Advance" | "Refund";
  purpose: string;
  collectedBy: string;
  date: string;
  status: "Active" | "Adjusted" | "Refunded";
  paymentMode: string;
};

const AdvanceCollectionTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  const advanceRecords: AdvanceRecord[] = [
    {
      id: "1",
      receiptNumber: "ADV001",
      patientName: "John Doe",
      amount: 10000,
      type: "Advance",
      purpose: "Surgery Deposit",
      collectedBy: "Reception Desk",
      date: "2024-01-15",
      status: "Active",
      paymentMode: "Cash"
    },
    {
      id: "2",
      receiptNumber: "REF001",
      patientName: "Mary Johnson",
      amount: 5000,
      type: "Refund",
      purpose: "Cancelled Procedure",
      collectedBy: "Accounts Dept",
      date: "2024-01-16",
      status: "Refunded",
      paymentMode: "Bank Transfer"
    },
    {
      id: "3",
      receiptNumber: "ADV002",
      patientName: "Robert Wilson",
      amount: 15000,
      type: "Advance",
      purpose: "Treatment Package",
      collectedBy: "Reception Desk",
      date: "2024-01-17",
      status: "Adjusted",
      paymentMode: "Card"
    }
  ];

  const types = ["all", "Advance", "Refund"];

  const filteredRecords = advanceRecords.filter(record => {
    const matchesSearch = record.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || record.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: AdvanceRecord["status"]) => {
    const statusConfig = {
      "Active": "bg-green-100 text-green-800",
      "Adjusted": "bg-blue-100 text-blue-800",
      "Refunded": "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: AdvanceRecord["type"]) => {
    const typeConfig = {
      "Advance": "bg-green-100 text-green-800",
      "Refund": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={typeConfig[type]}>
        {type}
      </Badge>
    );
  };

  const handleProcessRefund = (receiptNumber: string) => {
    toast({
      title: "Refund Processed",
      description: `Refund for receipt ${receiptNumber} has been initiated.`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Advance Collection & Refunds</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleProcessRefund("REF001")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Process Refund
              </Button>
              <AdvanceCollectionDialog />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by receipt number or patient name..."
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
          </div>

          {/* Records Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt Number</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Collected By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.receiptNumber}</TableCell>
                    <TableCell>{record.patientName}</TableCell>
                    <TableCell>₹{record.amount.toLocaleString()}</TableCell>
                    <TableCell>{getTypeBadge(record.type)}</TableCell>
                    <TableCell>{record.purpose}</TableCell>
                    <TableCell>{record.collectedBy}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.paymentMode}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <ViewDetailsDialog
                        title={`Advance Record - ${record.receiptNumber}`}
                        data={{
                          "Receipt Number": record.receiptNumber,
                          "Patient Name": record.patientName,
                          "Amount": `₹${record.amount.toLocaleString()}`,
                          "Type": record.type,
                          "Purpose": record.purpose,
                          "Collected By": record.collectedBy,
                          "Date": record.date,
                          "Payment Mode": record.paymentMode,
                          "Status": record.status
                        }}
                        downloadable={true}
                      />
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

export default AdvanceCollectionTab;
