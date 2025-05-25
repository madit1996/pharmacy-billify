
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

type IssueItem = {
  id: string;
  itemName: string;
  requestedQuantity: number;
  availableStock: number;
  unit: string;
};

const CreateIssueDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    department: "",
    requestedBy: "",
    priority: "Normal",
    notes: ""
  });
  const [items, setItems] = useState<IssueItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    itemName: "",
    requestedQuantity: 1
  });

  const departments = [
    "Cardiology",
    "Emergency", 
    "Orthopedics",
    "Radiology",
    "Laboratory",
    "ICU",
    "Surgery",
    "Pharmacy"
  ];

  const availableItems = [
    { name: "Surgical Gloves", stock: 150, unit: "Box" },
    { name: "Scalpel Blades", stock: 25, unit: "Pack" },
    { name: "Blood Collection Tubes", stock: 800, unit: "Piece" },
    { name: "IV Cannula", stock: 200, unit: "Piece" },
    { name: "Bandages", stock: 50, unit: "Roll" }
  ];

  const addItem = () => {
    if (currentItem.itemName && currentItem.requestedQuantity > 0) {
      const itemData = availableItems.find(item => item.name === currentItem.itemName);
      if (itemData) {
        const newItem: IssueItem = {
          id: Date.now().toString(),
          itemName: currentItem.itemName,
          requestedQuantity: currentItem.requestedQuantity,
          availableStock: itemData.stock,
          unit: itemData.unit
        };
        setItems([...items, newItem]);
        setCurrentItem({ itemName: "", requestedQuantity: 1 });
      }
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the issue request",
        variant: "destructive"
      });
      return;
    }

    const issueId = `ISS${String(Date.now()).slice(-3)}`;
    
    toast({
      title: "Issue Request Created",
      description: `Issue request ${issueId} created for ${formData.department} with ${items.length} items`,
    });
    
    setOpen(false);
    setFormData({ department: "", requestedBy: "", priority: "Normal", notes: "" });
    setItems([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Issue Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Department Issue Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Department *</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="requestedBy">Requested By *</Label>
              <Input
                id="requestedBy"
                value={formData.requestedBy}
                onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
                placeholder="Name of the requester"
                required
              />
            </div>
          </div>

          <div>
            <Label>Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Request Items</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Item Name</Label>
                <Select value={currentItem.itemName} onValueChange={(value) => setCurrentItem({...currentItem, itemName: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map(item => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name} (Stock: {item.stock} {item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="requestedQuantity">Requested Quantity</Label>
                <Input
                  id="requestedQuantity"
                  type="number"
                  value={currentItem.requestedQuantity}
                  onChange={(e) => setCurrentItem({...currentItem, requestedQuantity: parseInt(e.target.value) || 1})}
                  min="1"
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
                      <TableHead>Requested Qty</TableHead>
                      <TableHead>Available Stock</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.requestedQuantity}</TableCell>
                        <TableCell>{item.availableStock}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          {item.requestedQuantity <= item.availableStock ? (
                            <span className="text-green-600">Available</span>
                          ) : (
                            <span className="text-red-600">Insufficient Stock</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
              placeholder="Any special requirements or notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Issue Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueDialog;
