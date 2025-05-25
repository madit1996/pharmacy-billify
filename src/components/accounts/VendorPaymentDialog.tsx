
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VendorPaymentDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vendorName: "",
    invoiceNumber: "",
    invoiceAmount: 0,
    paymentAmount: 0,
    paymentMode: "",
    category: "",
    dueDate: "",
    description: "",
    documents: [] as File[]
  });

  const categories = [
    "Medical Supplies",
    "Equipment",
    "Pharmacy",
    "Laboratory",
    "Maintenance",
    "Utilities",
    "Services",
    "Other"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        documents: [...formData.documents, ...Array.from(e.target.files)]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentId = `PAY${String(Date.now()).slice(-6)}`;
    
    toast({
      title: "Payment Recorded",
      description: `Payment ${paymentId} of ₹${formData.paymentAmount.toLocaleString()} recorded for ${formData.vendorName}`,
    });
    
    setOpen(false);
    setFormData({
      vendorName: "",
      invoiceNumber: "",
      invoiceAmount: 0,
      paymentAmount: 0,
      paymentMode: "",
      category: "",
      dueDate: "",
      description: "",
      documents: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Vendor Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                value={formData.vendorName}
                onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                placeholder="Enter vendor name"
                required
              />
            </div>
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                placeholder="Enter invoice number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceAmount">Invoice Amount (₹) *</Label>
              <Input
                id="invoiceAmount"
                type="number"
                value={formData.invoiceAmount}
                onChange={(e) => setFormData({...formData, invoiceAmount: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="paymentAmount">Payment Amount (₹) *</Label>
              <Input
                id="paymentAmount"
                type="number"
                value={formData.paymentAmount}
                onChange={(e) => setFormData({...formData, paymentAmount: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Payment Mode *</Label>
              <Select value={formData.paymentMode} onValueChange={(value) => setFormData({...formData, paymentMode: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online Payment">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Payment description..."
              rows={3}
            />
          </div>

          {/* Document Upload */}
          <div>
            <Label>Supporting Documents</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="payment-document-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="payment-document-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload invoices/receipts</p>
                </div>
              </label>
              {formData.documents.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Uploaded files:</p>
                  <ul className="text-sm text-gray-600">
                    {formData.documents.map((file, index) => (
                      <li key={index}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorPaymentDialog;
