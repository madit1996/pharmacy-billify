
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Calendar, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLabContext } from "@/contexts/LabContext";
import BillingHistoryTable from "@/components/billing/BillingHistoryTable";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { LabProvider } from "@/contexts/LabContext";

const BillingHistoryContent = () => {
  const { completedTests } = useLabContext();
  const [activeTab, setActiveTab] = useState<"pharmacy" | "lab">("lab");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Group lab tests by billId for billing history
  const labBillsMap = completedTests.reduce((bills, test) => {
    if (test.billId) {
      if (!bills[test.billId]) {
        bills[test.billId] = {
          billId: test.billId,
          date: test.orderedDate,
          patientName: test.patientName,
          items: [],
          total: 0,
        };
      }
      
      bills[test.billId].items.push({
        name: test.testName,
        price: test.price || 0,
      });
      bills[test.billId].total += test.price || 0;
    }
    return bills;
  }, {} as Record<string, any>);
  
  const labBills = Object.values(labBillsMap);
  
  // Placeholder pharmacy bills (would come from pharmacy context in a real app)
  const pharmacyBills = [
    {
      billId: "PH001",
      date: new Date(2023, 7, 15),
      patientName: "John Smith",
      items: [
        { name: "Paracetamol", price: 5.99 },
        { name: "Antibiotics", price: 12.99 },
      ],
      total: 18.98,
    },
    {
      billId: "PH002",
      date: new Date(2023, 7, 16),
      patientName: "Sarah Johnson",
      items: [
        { name: "Vitamin C", price: 8.50 },
        { name: "Cough Syrup", price: 7.25 },
      ],
      total: 15.75,
    },
  ];
  
  // Filter bills based on search and date range
  const filterBills = (bills: any[]) => {
    return bills.filter((bill) => {
      // Filter by search term
      const matchesSearch =
        !searchTerm ||
        bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.billId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by date range
      const billDate = new Date(bill.date);
      const inDateRange =
        (!startDate || billDate >= startDate) &&
        (!endDate || billDate <= endDate);
      
      return matchesSearch && inDateRange;
    });
  };
  
  const filteredLabBills = filterBills(labBills);
  const filteredPharmacyBills = filterBills(pharmacyBills);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStartDate(undefined);
    setEndDate(undefined);
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Billing History</h1>
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pharmacy" | "lab")}>
          <TabsList>
            <TabsTrigger value="lab">Lab Billing</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy Billing</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by patient name or bill ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {/* Date range filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Calendar className="h-4 w-4" />
                  {startDate && endDate ? (
                    <span>
                      {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-4 space-y-4">
                  <h4 className="font-medium text-sm">Select start date</h4>
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                  <h4 className="font-medium text-sm">Select end date</h4>
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => startDate && date < startDate}
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Clear filters */}
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
            
            {/* Export button */}
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Active filters display */}
        {(searchTerm || startDate || endDate) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <Badge variant="outline" className="px-2 py-1 rounded-full">
                Search: {searchTerm}
                <button
                  className="ml-2 hover:text-destructive"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              </Badge>
            )}
            {(startDate || endDate) && (
              <Badge variant="outline" className="px-2 py-1 rounded-full">
                Date: {startDate ? format(startDate, "MMM d") : "Any"} - {endDate ? format(endDate, "MMM d, yyyy") : "Any"}
                <button
                  className="ml-2 hover:text-destructive"
                  onClick={() => {
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "lab" ? "Laboratory Billing History" : "Pharmacy Billing History"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pharmacy" | "lab")}>
              <TabsContent value="lab" className="mt-0">
                <BillingHistoryTable 
                  bills={filteredLabBills}
                  type="lab"
                />
              </TabsContent>
              <TabsContent value="pharmacy" className="mt-0">
                <BillingHistoryTable 
                  bills={filteredPharmacyBills}
                  type="pharmacy"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const BillingHistoryPage = () => {
  return (
    <LabProvider>
      <BillingHistoryContent />
    </LabProvider>
  );
};

export default BillingHistoryPage;
