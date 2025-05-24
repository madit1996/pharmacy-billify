
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Receipt } from "lucide-react";

type PatientBill = {
  id: string;
  billNumber: string;
  patientName: string;
  department: string;
  services: string[];
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: "Paid" | "Partial" | "Pending";
  billDate: string;
  paymentMode: string;
};

const PatientBillingTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const patientBills: PatientBill[] = [
    {
      id: "1",
      billNumber: "BILL001",
      patientName: "John Doe",
      department: "Cardiology",
      services: ["ECG", "Consultation", "Blood Test"],
      totalAmount: 5500,
      paidAmount: 5500,
      pendingAmount: 0,
      status: "Paid",
      billDate: "2024-01-15",
      paymentMode: "Cash"
    },
    {
      id: "2",
      billNumber: "BILL002",
      patientName: "Jane Smith",
      department: "Emergency",
      services: ["X-Ray", "Consultation", "Medicine"],
      totalAmount: 3200,
      paidAmount: 2000,
      pendingAmount: 1200,
      status: "Partial",
      billDate: "2024-01-16",
      paymentMode: "Card"
    },
    {
      id: "3",
      billNumber: "BILL003",
      patientName: "Robert Wilson",
      department: "Orthopedics",
      services: ["MRI", "Consultation"],
      totalAmount: 8500,
      paidAmount: 0,
      pendingAmount: 8500,
      status: "Pending",
      billDate: "2024-01-17",
      paymentMode: ""
    }
  ];

  const statuses = ["all", "Paid", "Partial", "Pending"];

  const filteredBills = patientBills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PatientBill["status"]) => {
    const statusConfig = {
      "Paid": "bg-green-100 text-green-800",
      "Partial": "bg-yellow-100 text-yellow-800",
      "Pending": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Patient Billing Summary</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Bill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by bill number or patient name..."
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

          {/* Bills Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill Number</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.billNumber}</TableCell>
                    <TableCell>{bill.patientName}</TableCell>
                    <TableCell>{bill.department}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {bill.services.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>₹{bill.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{bill.paidAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{bill.pendingAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Receipt className="h-4 w-4" />
                        </Button>
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

export default PatientBillingTab;
