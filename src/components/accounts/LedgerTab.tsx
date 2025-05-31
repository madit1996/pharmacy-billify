
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Download, Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LedgerEntry {
  id: string;
  date: Date;
  particulars: string;
  voucherNo: string;
  debit: number;
  credit: number;
  balance: number;
  type: "receipt" | "payment" | "journal";
}

interface AccountLedger {
  accountName: string;
  accountCode: string;
  openingBalance: number;
  entries: LedgerEntry[];
  closingBalance: number;
}

const LedgerTab = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>("cash");
  const [dateFrom, setDateFrom] = useState<string>("2024-01-01");
  const [dateTo, setDateTo] = useState<string>("2024-01-31");
  const { toast } = useToast();

  // Mock ledger data
  const accounts = [
    { code: "cash", name: "Cash Account" },
    { code: "bank", name: "Bank Account" },
    { code: "revenue", name: "Revenue Account" },
    { code: "expenses", name: "Expenses Account" },
    { code: "receivables", name: "Accounts Receivable" },
    { code: "payables", name: "Accounts Payable" }
  ];

  const ledgerData: Record<string, AccountLedger> = {
    cash: {
      accountName: "Cash Account",
      accountCode: "1001",
      openingBalance: 50000,
      closingBalance: 67850,
      entries: [
        {
          id: "L001",
          date: new Date("2024-01-15"),
          particulars: "Patient Payment - Cash",
          voucherNo: "RCP001",
          debit: 15000,
          credit: 0,
          balance: 65000,
          type: "receipt"
        },
        {
          id: "L002", 
          date: new Date("2024-01-16"),
          particulars: "Medicine Purchase",
          voucherNo: "PAY001",
          debit: 0,
          credit: 8500,
          balance: 56500,
          type: "payment"
        },
        {
          id: "L003",
          date: new Date("2024-01-17"),
          particulars: "Lab Test Payment",
          voucherNo: "RCP002",
          debit: 12000,
          credit: 0,
          balance: 68500,
          type: "receipt"
        },
        {
          id: "L004",
          date: new Date("2024-01-18"),
          particulars: "Petty Cash Expense",
          voucherNo: "PC001",
          debit: 0,
          credit: 650,
          balance: 67850,
          type: "payment"
        }
      ]
    },
    bank: {
      accountName: "Bank Account",
      accountCode: "1002", 
      openingBalance: 250000,
      closingBalance: 285000,
      entries: [
        {
          id: "L005",
          date: new Date("2024-01-15"),
          particulars: "Insurance Payment Received",
          voucherNo: "BNK001",
          debit: 45000,
          credit: 0,
          balance: 295000,
          type: "receipt"
        },
        {
          id: "L006",
          date: new Date("2024-01-20"),
          particulars: "Salary Payment",
          voucherNo: "BNK002",
          debit: 0,
          credit: 10000,
          balance: 285000,
          type: "payment"
        }
      ]
    }
  };

  const currentLedger = ledgerData[selectedAccount] || ledgerData.cash;

  const handleDownload = () => {
    toast({
      title: "Download",
      description: `Downloading ledger for ${currentLedger.accountName}`,
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print", 
      description: `Printing ledger for ${currentLedger.accountName}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Account Ledger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Select Account</Label>
              <select
                id="account"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {accounts.map((account) => (
                  <option key={account.code} value={account.code}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="flex items-end space-x-2">
              <Button className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Opening Balance</p>
              <p className="text-2xl font-bold text-blue-600">₹{currentLedger.openingBalance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Debit</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{currentLedger.entries.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Closing Balance</p>
              <p className="text-2xl font-bold text-purple-600">₹{currentLedger.closingBalance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {currentLedger.accountName} (Code: {currentLedger.accountCode})
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Eye className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Ledger Entries */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Particulars</TableHead>
                <TableHead>Voucher No.</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/50">
                <TableCell className="font-medium">Opening Balance</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right font-bold">₹{currentLedger.openingBalance.toLocaleString()}</TableCell>
              </TableRow>
              {currentLedger.entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date.toLocaleDateString()}</TableCell>
                  <TableCell>{entry.particulars}</TableCell>
                  <TableCell>{entry.voucherNo}</TableCell>
                  <TableCell className="text-right">
                    {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">₹{entry.balance.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>Closing Balance</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">₹{currentLedger.closingBalance.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LedgerTab;
