
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type POItem = {
  id: string;
  itemName: string;
  quantity: number;
  rate: number;
  total: number;
};

const CreatePODialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vendor: "",
    expectedDelivery: "",
    notes: ""
  });
  const [items, setItems] = useState<POItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    itemName: "",
    quantity: 1,
    rate: 0
  });

  const vendors = [
    "MedSupply Corp",
    "SurgiTech Solutions",
    "LabEquip India",
    "PharmaCare Supplies",
    "General Medical Co."
  ];

  const addItem = () => {
    if (currentItem.itemName && currentItem.quantity > 0 && currentItem.rate > 0) {
      const newItem: POItem = {
        id: Date.now().toString(),
        itemName: currentItem.itemName,
        quantity: currentItem.quantity,
        rate: currentItem.rate,
        total: currentItem.quantity * currentItem.rate
      };
      setItems([...items, newItem]);
      setCurrentItem({ itemName: "", quantity: 1, rate: 0 });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the purchase order",
        variant: "destructive"
      });
      return;
    }

    const poNumber = `PO${new Date().getFullYear()}${String(Date.now()).slice(-3)}`;
    
    toast({
      title: "Purchase Order Created",
      description: `PO ${poNumber} created for ${formData.vendor} with ${items.length} items (₹${totalAmount.toLocaleString()})`,
    });
    
    setOpen(false);
    setFormData({ vendor: "", expectedDelivery: "", notes: "" });
    setItems([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create PO
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vendor *</Label>
              <Select value={formData.vendor} onValueChange={(value) => setFormData({...formData, vendor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map(vendor => (
                    <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expectedDelivery">Expected Delivery Date *</Label>
              <Input
                id="expectedDelivery"
                type="date"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({...formData, expectedDelivery: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Add Items</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={currentItem.itemName}
                  onChange={(e) => setCurrentItem({...currentItem, itemName: e.target.value})}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="rate">Rate (₹)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={currentItem.rate}
                  onChange={(e) => setCurrentItem({...currentItem, rate: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={addItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.rate}</TableCell>
                        <TableCell>₹{item.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-semibold">Total Amount:</TableCell>
                      <TableCell className="font-semibold">₹{totalAmount.toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any special instructions or notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Purchase Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePODialog;
