import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VendorPaymentDialog from "./VendorPaymentDialog";
import ViewDetailsDialog from "../shared/ViewDetailsDialog";

type VendorPayment = {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentDate: string;
  dueDate: string;
  status: "Paid" | "Partial" | "Pending" | "Overdue";
  paymentMode: string;
  category: string;
};

const VendorPaymentTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const vendorPayments: VendorPayment[] = [
    {
      id: "1",
      vendorName: "MedSupply Corp",
      invoiceNumber: "INV001",
      invoiceAmount: 125000,
      paidAmount: 125000,
      pendingAmount: 0,
      paymentDate: "2024-01-15",
      dueDate: "2024-01-20",
      status: "Paid",
      paymentMode: "Bank Transfer",
      category: "Medical Supplies"
    },
    {
      id: "2",
      vendorName: "Equipment Solutions",
      invoiceNumber: "INV002",
      invoiceAmount: 85000,
      paidAmount: 50000,
      pendingAmount: 35000,
      paymentDate: "2024-01-10",
      dueDate: "2024-01-25",
      status: "Partial",
      paymentMode: "Cheque",
      category: "Equipment"
    },
    {
      id: "3",
      vendorName: "Pharma Distributors",
      invoiceNumber: "INV003",
      invoiceAmount: 95000,
      paidAmount: 0,
      pendingAmount: 95000,
      paymentDate: "",
      dueDate: "2024-01-18",
      status: "Overdue",
      paymentMode: "",
      category: "Pharmacy"
    }
  ];

  const statuses = ["all", "Paid", "Partial", "Pending", "Overdue"];

  const filteredPayments = vendorPayments.filter(payment => {
    const matchesSearch = payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: VendorPayment["status"]) => {
    const statusConfig = {
      "Paid": "bg-green-100 text-green-800",
      "Partial": "bg-yellow-100 text-yellow-800",
      "Pending": "bg-blue-100 text-blue-800",
      "Overdue": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const handleMarkPaid = (invoiceNumber: string) => {
    toast({
      title: "Payment Marked as Paid",
      description: `Invoice ${invoiceNumber} has been marked as paid.`,
    });
  };

  const handleSchedulePayment = (invoiceNumber: string) => {
    toast({
      title: "Payment Scheduled",
      description: `Payment for invoice ${invoiceNumber} has been scheduled.`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vendor Payment Tracking</CardTitle>
            <VendorPaymentDialog />
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by vendor name or invoice number..."
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

          {/* Payments Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Invoice Amount</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Pending Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.vendorName}</TableCell>
                    <TableCell>{payment.invoiceNumber}</TableCell>
                    <TableCell>₹{payment.invoiceAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{payment.paidAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{payment.pendingAmount.toLocaleString()}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.category}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <ViewDetailsDialog
                          title={`Payment Details - ${payment.invoiceNumber}`}
                          data={{
                            "Vendor Name": payment.vendorName,
                            "Invoice Number": payment.invoiceNumber,
                            "Invoice Amount": `₹${payment.invoiceAmount.toLocaleString()}`,
                            "Paid Amount": `₹${payment.paidAmount.toLocaleString()}`,
                            "Pending Amount": `₹${payment.pendingAmount.toLocaleString()}`,
                            "Due Date": payment.dueDate,
                            "Category": payment.category,
                            "Status": payment.status,
                            "Payment Mode": payment.paymentMode
                          }}
                          downloadable={true}
                        />
                        {payment.status !== "Paid" && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkPaid(payment.invoiceNumber)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleSchedulePayment(payment.invoiceNumber)}>
                          <Clock className="h-4 w-4" />
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

export default VendorPaymentTab;
