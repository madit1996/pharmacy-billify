
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViewGRNDialogProps {
  grnNumber: string;
}

type GRNItem = {
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unit: string;
  rate: number;
  batchNumber: string;
  expiryDate: string;
  total: number;
};

const ViewGRNDialog = ({ grnNumber }: ViewGRNDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Mock data - in real app, this would come from API
  const grnData = {
    grnNumber: "GRN2024001",
    poNumber: "PO2024003",
    vendor: "LabEquip India",
    receivedDate: "2024-01-22",
    receivedBy: "Store Manager",
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2024-01-20",
    totalAmount: 95000,
    status: "Verified",
    notes: "All items received in good condition",
    items: [
      {
        itemName: "Blood Collection Tubes",
        orderedQuantity: 100,
        receivedQuantity: 100,
        unit: "Pack",
        rate: 150,
        batchNumber: "BCT001",
        expiryDate: "2025-12-31",
        total: 15000
      },
      {
        itemName: "Surgical Gloves",
        orderedQuantity: 50,
        receivedQuantity: 48,
        unit: "Box",
        rate: 250,
        batchNumber: "SG002",
        expiryDate: "2026-06-30",
        total: 12000
      }
    ] as GRNItem[]
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print",
      description: `Printing GRN ${grnNumber}`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download",
      description: `Downloading ${grnNumber}.pdf`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>GRN Details - {grnNumber}</DialogTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">GRN Number:</span>
                <span>{grnData.grnNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">PO Number:</span>
                <span>{grnData.poNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Vendor:</span>
                <span>{grnData.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Received By:</span>
                <span>{grnData.receivedBy}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Received Date:</span>
                <span>{grnData.receivedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Invoice Number:</span>
                <span>{grnData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Invoice Date:</span>
                <span>{grnData.invoiceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <Badge className="bg-green-100 text-green-800">{grnData.status}</Badge>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Items Received</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Batch No.</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grnData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.orderedQuantity}</TableCell>
                      <TableCell>{item.receivedQuantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>₹{item.rate}</TableCell>
                      <TableCell>{item.batchNumber}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>₹{item.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={7} className="font-semibold">Total Amount:</TableCell>
                    <TableCell className="font-semibold">₹{grnData.totalAmount.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Notes */}
          {grnData.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{grnData.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewGRNDialog;
