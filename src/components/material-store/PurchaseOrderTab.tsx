
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, FileText, Eye } from "lucide-react";

type PurchaseOrder = {
  id: string;
  poNumber: string;
  vendor: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  status: "Draft" | "Sent" | "Acknowledged" | "Delivered" | "Cancelled";
  itemCount: number;
};

const PurchaseOrderTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: "1",
      poNumber: "PO2024001",
      vendor: "MedSupply Corp",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-01-25",
      totalAmount: 125000,
      status: "Sent",
      itemCount: 15
    },
    {
      id: "2",
      poNumber: "PO2024002",
      vendor: "SurgiTech Solutions",
      orderDate: "2024-01-16",
      expectedDelivery: "2024-01-30",
      totalAmount: 85000,
      status: "Draft",
      itemCount: 8
    },
    {
      id: "3",
      poNumber: "PO2024003",
      vendor: "LabEquip India",
      orderDate: "2024-01-14",
      expectedDelivery: "2024-01-22",
      totalAmount: 95000,
      status: "Delivered",
      itemCount: 12
    }
  ];

  const statuses = ["all", "Draft", "Sent", "Acknowledged", "Delivered", "Cancelled"];

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PurchaseOrder["status"]) => {
    const statusConfig = {
      "Draft": "bg-gray-100 text-gray-800",
      "Sent": "bg-blue-100 text-blue-800",
      "Acknowledged": "bg-yellow-100 text-yellow-800",
      "Delivered": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800"
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
            <CardTitle>Purchase Orders</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by PO number or vendor..."
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

          {/* Purchase Orders Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.poNumber}</TableCell>
                    <TableCell>{order.vendor}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.expectedDelivery}</TableCell>
                    <TableCell>{order.itemCount} items</TableCell>
                    <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
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

export default PurchaseOrderTab;
