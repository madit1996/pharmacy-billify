
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MedicineSearchPanel from "@/components/MedicineSearchPanel";
import { BillItem } from "@/pages/PharmacyPage";

interface MedicineTabsPanelProps {
  onAddToBill: (item: BillItem) => void;
}

const MedicineTabsPanel = ({ onAddToBill }: MedicineTabsPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <Tabs defaultValue="medicines">
        <div className="bg-gray-50 p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-pharmacy-text">Medicines</h3>
            
            <div className="flex space-x-2">
              <div className="relative w-full max-w-sm mr-2">
                <Input 
                  placeholder="Search Medicine/ Salt" 
                  className="pl-9 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              
              <Select defaultValue="sort">
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sort">Sort By</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="expiry">
                <SelectTrigger className="h-8 w-28 text-xs">
                  <SelectValue placeholder="Expiry Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">Expiry Date</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="margins">
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue placeholder="Margins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="margins">Margins</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="fifo">
                <SelectTrigger className="h-8 w-20 text-xs">
                  <SelectValue placeholder="FIFO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fifo">FIFO</SelectItem>
                  <SelectItem value="lifo">LIFO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsList className="grid grid-cols-7 bg-pharmacy-gray">
            <TabsTrigger value="medicines" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white text-xs">All</TabsTrigger>
            <TabsTrigger value="tablet" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white text-xs">Tablet</TabsTrigger>
            <TabsTrigger value="capsule" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white text-xs">Capsule</TabsTrigger>
            <TabsTrigger value="suppository" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white text-xs">Suppository</TabsTrigger>
            <TabsTrigger value="eyedrops" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white text-xs">Eyedrops</TabsTrigger>
            <TabsTrigger value="inhaler" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white text-xs">Inhaler</TabsTrigger>
            <TabsTrigger value="injectable" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white text-xs">Injectable</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="medicines" className="mt-0">
          <MedicineSearchPanel onAddToBill={onAddToBill} searchTerm={searchTerm} />
        </TabsContent>
        
        <TabsContent value="tablet" className="mt-0 p-4">
          <p className="text-sm text-gray-500">Tablet medicines will be shown here.</p>
        </TabsContent>
        
        <TabsContent value="capsule" className="mt-0 p-4">
          <p className="text-sm text-gray-500">Capsule medicines will be shown here.</p>
        </TabsContent>
        
        <TabsContent value="suppository" className="mt-0 p-4">
          <p className="text-sm text-gray-500">Suppository medicines will be shown here.</p>
        </TabsContent>
        
        <TabsContent value="eyedrops" className="mt-0 p-4">
          <p className="text-sm text-gray-500">Eyedrop medicines will be shown here.</p>
        </TabsContent>
        
        <TabsContent value="inhaler" className="mt-0 p-4">
          <p className="text-sm text-gray-500">Inhaler medicines will be shown here.</p>
        </TabsContent>
        
        <TabsContent value="injectable" className="mt-0 p-4">
          <p className="text-sm text-gray-500">Injectable medicines will be shown here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicineTabsPanel;
