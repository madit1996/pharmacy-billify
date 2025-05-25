
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Eye, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PurchaseInvoice = {
  id: string;
  invoiceNumber: string;
  grnNumber: string;
  vendor: string;
  invoiceDate: string;
  receivedDate: string;
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
  paymentStatus: "Pending" | "Partial" | "Paid" | "Overdue";
  stockUpdated: boolean;
  itemCount: number;
  dueDate: string;
};

const PurchaseInvoicesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const invoices: PurchaseInvoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      grnNumber: "GRN2024001",
      vendor: "LabEquip India",
      invoiceDate: "2024-01-20",
      receivedDate: "2024-01-22",
      totalAmount: 95000,
      taxAmount: 17100,
      netAmount: 112100,
      paymentStatus: "Pending",
      stockUpdated: true,
      itemCount: 12,
      dueDate: "2024-02-20"
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      grnNumber: "GRN2024002",
      vendor: "MedSupply Corp",
      invoiceDate: "2024-01-18",
      receivedDate: "2024-01-20",
      totalAmount: 118000,
      taxAmount: 21240,
      netAmount: 139240,
      paymentStatus: "Partial",
      stockUpdated: true,
      itemCount: 13,
      dueDate: "2024-02-18"
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      grnNumber: "GRN2024003",
      vendor: "SurgiTech Solutions",
      invoiceDate: "2024-01-15",
      receivedDate: "2024-01-17",
      totalAmount: 75000,
      taxAmount: 13500,
      netAmount: 88500,
      paymentStatus: "Paid",
      stockUpdated: true,
      itemCount: 8,
      dueDate: "2024-02-15"
    }
  ];

  const statuses = ["all", "Pending", "Partial", "Paid", "Overdue"];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPaymentStatusBadge = (status: PurchaseInvoice["paymentStatus"]) => {
    const statusConfig = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Partial": "bg-blue-100 text-blue-800",
      "Paid": "bg-green-100 text-green-800",
      "Overdue": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const handleViewInvoice = (invoiceNumber: string) => {
    toast({
      title: "View Invoice",
      description: `Opening details for ${invoiceNumber}`,
    });
  };

  const handlePrintInvoice = (invoiceNumber: string) => {
    toast({
      title: "Print Invoice",
      description: `Generating PDF for ${invoiceNumber}`,
    });
  };

  const handleMakePayment = (invoiceNumber: string) => {
    toast({
      title: "Payment Process",
      description: `Opening payment form for ${invoiceNumber}`,
    });
  };

  const handleUpdateStock = (invoiceNumber: string) => {
    toast({
      title: "Stock Updated",
      description: `Stock quantities updated for ${invoiceNumber}`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Purchase Invoices</CardTitle>
            <div className="text-sm text-gray-600">
              Total Outstanding: ₹{filteredInvoices
                .filter(inv => inv.paymentStatus !== "Paid")
                .reduce((sum, inv) => sum + inv.netAmount, 0)
                .toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by invoice, GRN number, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by payment status" />
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Pending Payment</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {invoices.filter(inv => inv.paymentStatus === "Pending").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    {invoices.filter(inv => inv.paymentStatus === "Paid").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {invoices.filter(inv => inv.paymentStatus === "Overdue").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoices Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>GRN Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.grnNumber}</TableCell>
                    <TableCell>{invoice.vendor}</TableCell>
                    <TableCell>{invoice.invoiceDate}</TableCell>
                    <TableCell>
                      <span className={new Date(invoice.dueDate) < new Date() && invoice.paymentStatus !== "Paid" ? "text-red-600 font-medium" : ""}>
                        {invoice.dueDate}
                      </span>
                    </TableCell>
                    <TableCell>₹{invoice.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{invoice.taxAmount.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">₹{invoice.netAmount.toLocaleString()}</TableCell>
                    <TableCell>{getPaymentStatusBadge(invoice.paymentStatus)}</TableCell>
                    <TableCell>
                      {invoice.stockUpdated ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Updated
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Pending
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.invoiceNumber)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePrintInvoice(invoice.invoiceNumber)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {invoice.paymentStatus !== "Paid" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMakePayment(invoice.invoiceNumber)}
                          >
                            Pay
                          </Button>
                        )}
                        {!invoice.stockUpdated && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStock(invoice.invoiceNumber)}
                          >
                            Update Stock
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

export default PurchaseInvoicesTab;
