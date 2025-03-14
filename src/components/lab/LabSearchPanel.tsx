
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabBillItem } from "@/pages/LabTestsPage";

interface LabTestOption {
  id: string;
  testName: string;
  price: number;
  category: 'pathology' | 'radiology' | 'other';
}

interface LabSearchPanelProps {
  testOptions: readonly LabTestOption[];
  onAddToBill: (item: LabBillItem) => void;
}

const LabSearchPanel = ({ testOptions, onAddToBill }: LabSearchPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTests = searchTerm
    ? testOptions.filter(test => 
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : testOptions;

  const pathologyTests = filteredTests.filter(test => test.category === 'pathology');
  const radiologyTests = filteredTests.filter(test => test.category === 'radiology');

  const handleAddToBill = (test: LabTestOption) => {
    const billItem: LabBillItem = {
      id: test.id,
      testName: test.testName,
      price: test.price,
      quantity: 1,
      discount: 0,
      category: test.category
    };
    
    onAddToBill(billItem);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Input 
            placeholder="Search for tests..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 overflow-hidden">
        <TabsList className="grid grid-cols-3 px-4 py-2">
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="pathology">Pathology</TabsTrigger>
          <TabsTrigger value="radiology">Radiology</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="p-4 overflow-y-auto flex-1">
          <TestList tests={filteredTests} onAddToBill={handleAddToBill} />
        </TabsContent>
        
        <TabsContent value="pathology" className="p-4 overflow-y-auto flex-1">
          <TestList tests={pathologyTests} onAddToBill={handleAddToBill} />
        </TabsContent>
        
        <TabsContent value="radiology" className="p-4 overflow-y-auto flex-1">
          <TestList tests={radiologyTests} onAddToBill={handleAddToBill} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TestListProps {
  tests: readonly LabTestOption[];
  onAddToBill: (test: LabTestOption) => void;
}

const TestList = ({ tests, onAddToBill }: TestListProps) => {
  if (tests.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No tests found matching your search
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tests.map((test) => (
        <div 
          key={test.id} 
          className="border rounded-md p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-sm">{test.testName}</h3>
              <span className="text-xs text-gray-500 capitalize">{test.category}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-blue-600 mr-2">
                ${test.price.toFixed(2)}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={() => onAddToBill(test)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LabSearchPanel;
