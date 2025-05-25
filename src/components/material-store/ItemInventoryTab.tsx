import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, Edit, BarChart3 } from "lucide-react";
import AddItemDialog from "./AddItemDialog";
import { useToast } from "@/hooks/use-toast";

type Item = {
  id: string;
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  rate: number;
  location: string;
  lastUpdated: string;
};

const ItemInventoryTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  const items: Item[] = [
    {
      id: "1",
      code: "MED001",
      name: "Surgical Gloves (Box)",
      category: "Medical Supplies",
      currentStock: 150,
      minStock: 50,
      maxStock: 500,
      unit: "Box",
      rate: 250,
      location: "A-1-2",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      code: "SUR002",
      name: "Scalpel Blades #15",
      category: "Surgical",
      currentStock: 25,
      minStock: 30,
      maxStock: 200,
      unit: "Pack",
      rate: 180,
      location: "B-2-1",
      lastUpdated: "2024-01-14"
    },
    {
      id: "3",
      code: "LAB003",
      name: "Blood Collection Tubes",
      category: "Laboratory",
      currentStock: 800,
      minStock: 200,
      maxStock: 1000,
      unit: "Piece",
      rate: 15,
      location: "C-1-3",
      lastUpdated: "2024-01-16"
    }
  ];

  const categories = ["all", "Medical Supplies", "Surgical", "Laboratory", "Pharmacy", "General"];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item: Item) => {
    if (item.currentStock <= item.minStock) {
      return { status: "Low Stock", color: "bg-red-100 text-red-800" };
    } else if (item.currentStock >= item.maxStock * 0.9) {
      return { status: "High Stock", color: "bg-blue-100 text-blue-800" };
    } else {
      return { status: "Normal", color: "bg-green-100 text-green-800" };
    }
  };

  const handleStockAdjustment = (itemName: string) => {
    toast({
      title: "Stock Adjustment",
      description: `Stock adjustment form opened for ${itemName}`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Item Inventory</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Stock Report
              </Button>
              <AddItemDialog />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Items Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min/Max Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate (₹)</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.currentStock <= item.minStock && (
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="font-medium">{item.currentStock}</TableCell>
                      <TableCell>{item.minStock} / {item.maxStock}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>₹{item.rate}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStockAdjustment(item.name)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemInventoryTab;
