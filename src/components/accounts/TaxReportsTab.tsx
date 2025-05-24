
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, Calculator } from "lucide-react";
import { format } from "date-fns";

type TaxRecord = {
  id: string;
  month: string;
  gstCollected: number;
  gstPaid: number;
  netGST: number;
  tdsDeducted: number;
  tdsDeposited: number;
  status: "Filed" | "Pending" | "Due";
  filingDate: string;
};

const TaxReportsTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reportType, setReportType] = useState("gst");

  const taxRecords: TaxRecord[] = [
    {
      id: "1",
      month: "January 2024",
      gstCollected: 45000,
      gstPaid: 25000,
      netGST: 20000,
      tdsDeducted: 12000,
      tdsDeposited: 12000,
      status: "Filed",
      filingDate: "2024-02-15"
    },
    {
      id: "2",
      month: "February 2024",
      gstCollected: 52000,
      gstPaid: 28000,
      netGST: 24000,
      tdsDeducted: 15000,
      tdsDeposited: 15000,
      status: "Filed",
      filingDate: "2024-03-15"
    },
    {
      id: "3",
      month: "March 2024",
      gstCollected: 48000,
      gstPaid: 26000,
      netGST: 22000,
      tdsDeducted: 13000,
      tdsDeposited: 0,
      status: "Pending",
      filingDate: ""
    }
  ];

  const reportTypes = [
    { value: "gst", label: "GST Report" },
    { value: "tds", label: "TDS Report" },
    { value: "combined", label: "Combined Tax Report" }
  ];

  const getStatusBadge = (status: TaxRecord["status"]) => {
    const statusConfig = {
      "Filed": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Due": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total GST Collected</p>
                <p className="text-2xl font-bold text-green-600">₹1,45,000</p>
              </div>
              <Calculator className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net GST Payable</p>
                <p className="text-2xl font-bold text-blue-600">₹66,000</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TDS Deducted</p>
                <p className="text-2xl font-bold text-orange-600">₹40,000</p>
              </div>
              <Calculator className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending TDS</p>
                <p className="text-2xl font-bold text-red-600">₹13,000</p>
              </div>
              <FileText className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>GST & TDS Reports</CardTitle>
            <div className="flex space-x-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tax Records Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>GST Collected</TableHead>
                  <TableHead>GST Paid</TableHead>
                  <TableHead>Net GST</TableHead>
                  <TableHead>TDS Deducted</TableHead>
                  <TableHead>TDS Deposited</TableHead>
                  <TableHead>Filing Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.month}</TableCell>
                    <TableCell>₹{record.gstCollected.toLocaleString()}</TableCell>
                    <TableCell>₹{record.gstPaid.toLocaleString()}</TableCell>
                    <TableCell>₹{record.netGST.toLocaleString()}</TableCell>
                    <TableCell>₹{record.tdsDeducted.toLocaleString()}</TableCell>
                    <TableCell>₹{record.tdsDeposited.toLocaleString()}</TableCell>
                    <TableCell>{record.filingDate || "-"}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReportsTab;
