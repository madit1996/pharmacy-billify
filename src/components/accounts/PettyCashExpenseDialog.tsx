
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface PettyCashExpenseDialogProps {
  children: React.ReactNode;
  onAddExpense: (expense: {
    date: Date;
    description: string;
    category: string;
    amount: number;
    requestedBy: string;
    receipt?: string;
  }) => void;
}

interface ExpenseFormData {
  date: string;
  description: string;
  category: string;
  amount: string;
  requestedBy: string;
  receipt: string;
}

const PettyCashExpenseDialog = ({ children, onAddExpense }: PettyCashExpenseDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<ExpenseFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      category: "",
      amount: "",
      requestedBy: "",
      receipt: ""
    }
  });

  const categories = [
    "Office Supplies",
    "Refreshments", 
    "Transportation",
    "Emergency Purchases",
    "Maintenance",
    "Other"
  ];

  const handleSubmit = (data: ExpenseFormData) => {
    onAddExpense({
      date: new Date(data.date),
      description: data.description,
      category: data.category,
      amount: parseFloat(data.amount),
      requestedBy: data.requestedBy,
      receipt: data.receipt || undefined
    });
    
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Petty Cash Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date", { required: "Date is required" })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register("amount", { 
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be greater than 0" }
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Expense description"
              {...form.register("description", { required: "Description is required" })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("category", { required: "Category is required" })}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                placeholder="Staff name"
                {...form.register("requestedBy", { required: "Requester name is required" })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt/Reference (Optional)</Label>
            <Input
              id="receipt"
              placeholder="Receipt number or reference"
              {...form.register("receipt")}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Record Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PettyCashExpenseDialog;
