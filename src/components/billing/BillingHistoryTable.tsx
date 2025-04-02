
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Bill {
  billId: string;
  date: Date;
  patientName: string;
  items: { name: string; price: number }[];
  total: number;
}

interface BillingHistoryTableProps {
  bills: Bill[];
  type: "lab" | "pharmacy";
}

const BillingHistoryTable = ({ bills, type }: BillingHistoryTableProps) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  
  if (bills.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        <p>No billing history available</p>
      </div>
    );
  }
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bill ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.billId}>
              <TableCell className="font-medium">{bill.billId}</TableCell>
              <TableCell>{format(new Date(bill.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{bill.patientName}</TableCell>
              <TableCell>{bill.items.length} item(s)</TableCell>
              <TableCell className="text-right">${bill.total.toFixed(2)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setSelectedBill(bill)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Bill Details Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Bill Details - {selectedBill?.billId}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBill && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient Name</p>
                  <p>{selectedBill.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{format(new Date(selectedBill.date), "MMM d, yyyy")}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Items</p>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBill.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell className="font-medium">Total</TableCell>
                        <TableCell className="text-right font-medium">${selectedBill.total.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <DialogFooter>
                <Button className="w-full sm:w-auto" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillingHistoryTable;
