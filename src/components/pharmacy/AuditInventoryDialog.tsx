
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Package, Scan, Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditItem {
  id: string;
  name: string;
  batch: string;
  expiryDate: string;
  systemStock: number;
  physicalCount: number;
  variance: number;
  unit: string;
  location: string;
  status: 'pending' | 'completed' | 'variance';
}

const AuditInventoryDialog = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("scan");
  const [searchTerm, setSearchTerm] = useState("");
  const [auditItems, setAuditItems] = useState<AuditItem[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      batch: "BT001",
      expiryDate: "2025-12-31",
      systemStock: 250,
      physicalCount: 0,
      variance: 0,
      unit: "tablets",
      location: "A1-B2",
      status: 'pending'
    },
    {
      id: "2", 
      name: "Amoxicillin 250mg",
      batch: "BT045",
      expiryDate: "2025-08-15",
      systemStock: 120,
      physicalCount: 115,
      variance: -5,
      unit: "capsules",
      location: "A2-C1",
      status: 'variance'
    },
    {
      id: "3",
      name: "Insulin Pen",
      batch: "BT089",
      expiryDate: "2025-06-30",
      systemStock: 45,
      physicalCount: 45,
      variance: 0,
      unit: "units",
      location: "C1-A3",
      status: 'completed'
    }
  ]);

  const { toast } = useToast();

  const updatePhysicalCount = (id: string, count: number) => {
    setAuditItems(items => 
      items.map(item => {
        if (item.id === id) {
          const variance = count - item.systemStock;
          const status = count === 0 ? 'pending' : variance === 0 ? 'completed' : 'variance';
          return { ...item, physicalCount: count, variance, status };
        }
        return item;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'variance': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const completeAudit = () => {
    const pendingItems = auditItems.filter(item => item.status === 'pending').length;
    if (pendingItems > 0) {
      toast({
        title: "Audit incomplete",
        description: `${pendingItems} items still need physical count`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Audit completed",
      description: "Inventory audit has been completed and adjustments processed",
    });
    setOpen(false);
  };

  const auditSummary = {
    total: auditItems.length,
    completed: auditItems.filter(item => item.status === 'completed').length,
    variances: auditItems.filter(item => item.status === 'variance').length,
    pending: auditItems.filter(item => item.status === 'pending').length,
    totalVariance: auditItems.reduce((sum, item) => sum + Math.abs(item.variance), 0)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
          <AlertTriangle className="h-5 w-5 mb-1" />
          <span className="text-sm">Audit Inventory</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Audit
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{auditSummary.total}</h3>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600">{auditSummary.completed}</h3>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-600">{auditSummary.variances}</h3>
                <p className="text-sm text-gray-500">Variances</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-600">{auditSummary.pending}</h3>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Scan Items
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scan Items for Physical Count</CardTitle>
                <CardDescription>Scan barcodes or manually enter physical counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="barcode">Scan Barcode or Search Item</Label>
                      <Input
                        id="barcode"
                        placeholder="Scan barcode or type item name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button className="mt-6">
                      <Scan className="h-4 w-4 mr-2" />
                      Scan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>System Stock</TableHead>
                  <TableHead>Physical Count</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">Exp: {item.expiryDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.systemStock} {item.unit}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.physicalCount}
                        onChange={(e) => updatePhysicalCount(item.id, Number(e.target.value))}
                        className="w-20"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <span className={getVarianceColor(item.variance)}>
                        {item.variance > 0 ? '+' : ''}{item.variance}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Summary Report</CardTitle>
                <CardDescription>Complete audit overview and variance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Audit Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Items Audited:</span>
                          <span>{auditSummary.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Items with Variances:</span>
                          <span className="text-red-600">{auditSummary.variances}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Variance (abs):</span>
                          <span>{auditSummary.totalVariance} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accuracy Rate:</span>
                          <span className="text-green-600">
                            {((auditSummary.completed / auditSummary.total) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Required Actions</h4>
                      <div className="space-y-2 text-sm">
                        {auditSummary.variances > 0 && (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            Stock adjustments needed
                          </div>
                        )}
                        {auditSummary.pending > 0 && (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <Package className="h-4 w-4" />
                            Physical count pending
                          </div>
                        )}
                        {auditSummary.pending === 0 && auditSummary.variances === 0 && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Audit completed successfully
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline">Save Progress</Button>
            <Button variant="outline">Export Report</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={completeAudit}>
              Complete Audit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditInventoryDialog;
