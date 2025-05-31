
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PettyCashExpenseDialog from "./PettyCashExpenseDialog";

interface PettyCashExpense {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
  requestedBy: string;
  approvedBy?: string;
  status: "pending" | "approved" | "rejected";
  receipt?: string;
}

const PettyCashTab = () => {
  const [expenses, setExpenses] = useState<PettyCashExpense[]>([
    {
      id: "PC001",
      date: new Date("2024-01-15"),
      description: "Office supplies - stationery",
      category: "Office Supplies",
      amount: 850,
      requestedBy: "Dr. Smith",
      approvedBy: "Admin",
      status: "approved"
    },
    {
      id: "PC002",
      date: new Date("2024-01-16"),
      description: "Tea/Coffee for staff room",
      category: "Refreshments",
      amount: 450,
      requestedBy: "Nurse Manager",
      status: "pending"
    }
  ]);

  const { toast } = useToast();

  const handleAddExpense = (expenseData: Omit<PettyCashExpense, "id" | "status">) => {
    const newExpense: PettyCashExpense = {
      ...expenseData,
      id: `PC${String(expenses.length + 1).padStart(3, '0')}`,
      status: "pending"
    };
    setExpenses([newExpense, ...expenses]);
    toast({
      title: "Success",
      description: "Petty cash expense recorded successfully",
    });
  };

  const handleApprove = (id: string) => {
    setExpenses(expenses.map(expense => 
      expense.id === id 
        ? { ...expense, status: "approved" as const, approvedBy: "Current User" }
        : expense
    ));
    toast({
      title: "Approved",
      description: `Expense ${id} has been approved`,
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === "pending").length;
  const approvedExpenses = expenses.filter(e => e.status === "approved").reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-orange-600">{pendingExpenses}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{approvedExpenses.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Petty Cash Expenses</h2>
        <PettyCashExpenseDialog onAddExpense={handleAddExpense}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Expense
          </Button>
        </PettyCashExpenseDialog>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{expense.requestedBy}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        expense.status === "approved" 
                          ? "bg-green-100 text-green-800" 
                          : expense.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {expense.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApprove(expense.id)}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PettyCashTab;
