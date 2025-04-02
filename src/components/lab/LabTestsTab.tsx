
import { useState } from "react";
import { useLabContext } from "@/contexts/LabContext";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { filterTests } from "@/utils/lab-filters";
import LabFilters from "./LabFilters";
import LabTestTabs from "./LabTestTabs";

const LabTestsTab = () => {
  const { pendingTests, completedTests, handleSelectTest } = useLabContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  // Filter tests based on search, dates, and category
  const filteredPendingTests = filterTests(
    pendingTests,
    searchTerm,
    startDate,
    endDate,
    selectedCategory
  );
  
  const filteredCompletedTests = filterTests(
    completedTests,
    searchTerm,
    startDate,
    endDate,
    selectedCategory
  );

  return (
    <div className="space-y-6">
      <LabFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Test Reports</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <LabTestTabs
            pendingTests={filteredPendingTests}
            completedTests={filteredCompletedTests}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSelectTest={handleSelectTest}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LabTestsTab;
