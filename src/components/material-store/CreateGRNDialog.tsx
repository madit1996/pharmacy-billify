
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, AlertTriangle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GRNItem = {
  id: string;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unit: string;
  rate: number;
  batchNumber: string;
  expiryDate: string;
  total: number;
  discrepancy: boolean;
  isNonPOItem?: boolean;
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
    notes: "",
    isDirectInvoice: false
  });
  const [items, setItems] = useState<GRNItem[]>([]);

  const availablePOs = [
    { 
      poNumber: "PO2024001", 
      vendor: "MedSupply Corp",
      items: [
        { name: "Surgical Gloves", ordered: 50, rate: 250, unit: "Box" },
        { name: "Syringes", ordered: 100, rate: 15, unit: "Pack" }
      ]
    },
    { 
      poNumber: "PO2024002", 
      vendor: "SurgiTech Solutions",
      items: [
        { name: "Scalpel Blades", ordered: 20, rate: 180, unit: "Pack" },
        { name: "Sutures", ordered: 30, rate: 120, unit: "Box" }
      ]
    }
  ];

  const units = ["Piece", "Box", "Pack", "Roll", "Bottle", "Tube", "Kit", "Set", "Vial", "Strip"];

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
        unit: item.unit,
        rate: item.rate,
        batchNumber: "",
        expiryDate: "",
        total: item.ordered * item.rate,
        discrepancy: false
      }));
      
      setItems(poItems);
    }
  };

  const addNonPOItem = () => {
    const newItem: GRNItem = {
      id: `non-po-${Date.now()}`,
      itemName: "",
      orderedQuantity: 0,
      receivedQuantity: 0,
      unit: "Piece",
      rate: 0,
      batchNumber: "",
      expiryDate: "",
      total: 0,
      discrepancy: false,
      isNonPOItem: true
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof GRNItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'receivedQuantity' || field === 'rate') {
          updatedItem.total = updatedItem.receivedQuantity * updatedItem.rate;
          updatedItem.discrepancy = !updatedItem.isNonPOItem && updatedItem.receivedQuantity !== updatedItem.orderedQuantity;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const hasDiscrepancies = items.some(item => item.discrepancy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.isDirectInvoice && !formData.poNumber) {
      toast({
        title: "Error",
        description: "Please select a purchase order or mark as direct invoice",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
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
      notes: "",
      isDirectInvoice: false
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Goods Receipt Note (GRN)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="directInvoice"
              checked={formData.isDirectInvoice}
              onChange={(e) => setFormData({...formData, isDirectInvoice: e.target.checked, poNumber: ""})}
            />
            <Label htmlFor="directInvoice">Direct Invoice (No PO)</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {!formData.isDirectInvoice ? (
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
            ) : (
              <div>
                <Label htmlFor="vendor">Vendor *</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  placeholder="Enter vendor name"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                readOnly={!formData.isDirectInvoice}
                className={!formData.isDirectInvoice ? "bg-gray-50" : ""}
                placeholder={formData.isDirectInvoice ? "Enter vendor name" : "Auto-filled from PO"}
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
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                placeholder="Vendor invoice number"
                required
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button type="button" variant="outline" onClick={addNonPOItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Non-PO Item
              </Button>
            </div>
            
            {items.length > 0 && (
              <div className="border rounded overflow-x-auto">
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
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className={item.discrepancy ? "bg-yellow-50" : ""}>
                        <TableCell>
                          {item.isNonPOItem ? (
                            <Input
                              value={item.itemName}
                              onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                              placeholder="Enter item name"
                              className="w-32"
                            />
                          ) : (
                            item.itemName
                          )}
                        </TableCell>
                        <TableCell>
                          {item.isNonPOItem ? (
                            <Input
                              type="number"
                              value={item.orderedQuantity}
                              onChange={(e) => updateItem(item.id, 'orderedQuantity', parseInt(e.target.value) || 0)}
                              className="w-20"
                              min="0"
                            />
                          ) : (
                            item.orderedQuantity
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.receivedQuantity}
                            onChange={(e) => updateItem(item.id, 'receivedQuantity', parseInt(e.target.value) || 0)}
                            min="0"
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          {item.isNonPOItem ? (
                            <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map(unit => (
                                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            item.unit
                          )}
                        </TableCell>
                        <TableCell>
                          {item.isNonPOItem ? (
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                              className="w-24"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            `₹${item.rate}`
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.batchNumber}
                            onChange={(e) => updateItem(item.id, 'batchNumber', e.target.value)}
                            placeholder="Batch #"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                            className="w-32"
                          />
                        </TableCell>
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
                        <TableCell>
                          {item.isNonPOItem && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={7} className="font-semibold">Total Amount:</TableCell>
                      <TableCell className="font-semibold">₹{totalAmount.toLocaleString()}</TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
            
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
