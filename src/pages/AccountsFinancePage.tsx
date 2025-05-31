
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Receipt, CreditCard, FileText, Wallet, BookOpen } from "lucide-react";
import PatientBillingTab from "@/components/accounts/PatientBillingTab";
import AdvanceCollectionTab from "@/components/accounts/AdvanceCollectionTab";
import VendorPaymentTab from "@/components/accounts/VendorPaymentTab";
import TaxReportsTab from "@/components/accounts/TaxReportsTab";
import PettyCashTab from "@/components/accounts/PettyCashTab";
import LedgerTab from "@/components/accounts/LedgerTab";

const AccountsFinancePage = () => {
  const [activeTab, setActiveTab] = useState("billing");

  const financeStats = {
    dailyRevenue: 485000,
    pendingPayments: 125000,
    advanceCollection: 85000,
    taxLiability: 45000,
    pettyCashExpenses: 12500,
    totalLedgerBalance: 352850
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Accounts & Finance</h1>
          <p className="text-gray-600">Manage billing, payments, and financial reports</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Daily Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{financeStats.dailyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-orange-600">₹{financeStats.pendingPayments.toLocaleString()}</p>
              </div>
              <Receipt className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Advance Collection</p>
                <p className="text-2xl font-bold text-blue-600">₹{financeStats.advanceCollection.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tax Liability</p>
                <p className="text-2xl font-bold text-purple-600">₹{financeStats.taxLiability.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Petty Cash</p>
                <p className="text-2xl font-bold text-red-600">₹{financeStats.pettyCashExpenses.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ledger Balance</p>
                <p className="text-2xl font-bold text-teal-600">₹{financeStats.totalLedgerBalance.toLocaleString()}</p>
              </div>
              <BookOpen className="h-8 w-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="billing">Patient Billing</TabsTrigger>
          <TabsTrigger value="advance">Advance Collection</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Payments</TabsTrigger>
          <TabsTrigger value="pettycash">Petty Cash</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="reports">Tax Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="space-y-4">
          <PatientBillingTab />
        </TabsContent>

        <TabsContent value="advance" className="space-y-4">
          <AdvanceCollectionTab />
        </TabsContent>

        <TabsContent value="vendor" className="space-y-4">
          <VendorPaymentTab />
        </TabsContent>

        <TabsContent value="pettycash" className="space-y-4">
          <PettyCashTab />
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          <LedgerTab />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <TaxReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountsFinancePage;
