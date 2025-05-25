
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GRNItem = {
  id: string;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  rate: number;
  total: number;
  discrepancy: boolean;
};

const CreateGRNDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    poNumber: "",
    vendor: "",
    receivedBy: "",
    invoiceNumber: "",
    invoiceDate: "",
    notes: ""
  });
  const [items, setItems] = useState<GRNItem[]>([]);

  const availablePOs = [
    { 
      poNumber: "PO2024001", 
      vendor: "MedSupply Corp",
      items: [
        { name: "Surgical Gloves", ordered: 50, rate: 250 },
        { name: "Syringes", ordered: 100, rate: 15 }
      ]
    },
    { 
      poNumber: "PO2024002", 
      vendor: "SurgiTech Solutions",
      items: [
        { name: "Scalpel Blades", ordered: 20, rate: 180 },
        { name: "Sutures", ordered: 30, rate: 120 }
      ]
    }
  ];

  const handlePOSelection = (poNumber: string) => {
    const selectedPO = availablePOs.find(po => po.poNumber === poNumber);
    if (selectedPO) {
      setFormData({
        ...formData,
        poNumber: poNumber,
        vendor: selectedPO.vendor
      });
      
      const poItems: GRNItem[] = selectedPO.items.map((item, index) => ({
        id: `${poNumber}-${index}`,
        itemName: item.name,
        orderedQuantity: item.ordered,
        receivedQuantity: item.ordered,
        rate: item.rate,
        total: item.ordered * item.rate,
        discrepancy: false
      }));
      
      setItems(poItems);
    }
  };

  const updateReceivedQuantity = (id: string, receivedQuantity: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const total = receivedQuantity * item.rate;
        const discrepancy = receivedQuantity !== item.orderedQuantity;
        return { ...item, receivedQuantity, total, discrepancy };
      }
      return item;
    }));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const hasDiscrepancies = items.some(item => item.discrepancy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please select a purchase order to create GRN",
        variant: "destructive"
      });
      return;
    }

    const grnNumber = `GRN${new Date().getFullYear()}${String(Date.now()).slice(-3)}`;
    
    toast({
      title: "GRN Created Successfully",
      description: `GRN ${grnNumber} created for ${formData.vendor} - Amount: ₹${totalAmount.toLocaleString()}${hasDiscrepancies ? ' (with discrepancies)' : ''}`,
    });
    
    setOpen(false);
    setFormData({
      poNumber: "",
      vendor: "",
      receivedBy: "",
      invoiceNumber: "",
      invoiceDate: "",
      notes: ""
    });
    setItems([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create GRN
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Goods Receipt Note (GRN)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Purchase Order *</Label>
              <Select value={formData.poNumber} onValueChange={handlePOSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purchase order" />
                </SelectTrigger>
                <SelectContent>
                  {availablePOs.map(po => (
                    <SelectItem key={po.poNumber} value={po.poNumber}>
                      {po.poNumber} - {po.vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="receivedBy">Received By *</Label>
              <Input
                id="receivedBy"
                value={formData.receivedBy}
                onChange={(e) => setFormData({...formData, receivedBy: e.target.value})}
                placeholder="Name of receiver"
                required
              />
            </div>
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                placeholder="Vendor invoice number"
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
              />
            </div>
          </div>

          {items.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Items Received</h3>
              <div className="border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Ordered Qty</TableHead>
                      <TableHead>Received Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className={item.discrepancy ? "bg-yellow-50" : ""}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.orderedQuantity}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.receivedQuantity}
                            onChange={(e) => updateReceivedQuantity(item.id, parseInt(e.target.value) || 0)}
                            min="0"
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>₹{item.rate}</TableCell>
                        <TableCell>₹{item.total.toLocaleString()}</TableCell>
                        <TableCell>
                          {item.discrepancy ? (
                            <div className="flex items-center text-yellow-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Discrepancy
                            </div>
                          ) : (
                            <span className="text-green-600">OK</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="font-semibold">Total Amount:</TableCell>
                      <TableCell className="font-semibold">₹{totalAmount.toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              {hasDiscrepancies && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center text-yellow-800">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Discrepancies Detected</span>
                  </div>
                  <p className="text-yellow-700 mt-1">
                    Some items have quantity discrepancies. Please verify the received quantities.
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any observations, damages, or additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create GRN
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGRNDialog;
