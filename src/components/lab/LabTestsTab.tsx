
import { useState } from "react";
import { useLabContext } from "@/contexts/LabContext";
import { Search, Calendar, Filter, Download, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import CompletedTestsList from "./CompletedTestsList";
import PendingTestsList from "./PendingTestsList";
import { Badge } from "@/components/ui/badge";
import { LabTest } from "@/types/lab-tests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LabTestsTab = () => {
  const { pendingTests, completedTests, handleSelectTest } = useLabContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  // Filter tests based on search, dates, and category
  const filterTests = (tests: LabTest[]) => {
    return tests.filter((test) => {
      // Filter by search term (match patient name or test name)
      const matchesSearch =
        !searchTerm ||
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testName.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by date range
      const inDateRange =
        (!startDate || new Date(test.orderedDate) >= startDate) &&
        (!endDate || new Date(test.orderedDate) <= endDate);

      // Filter by category
      const matchesCategory = !selectedCategory || test.category === selectedCategory;

      return matchesSearch && inDateRange && matchesCategory;
    });
  };

  const filteredPendingTests = filterTests(pendingTests);
  const filteredCompletedTests = filterTests(completedTests);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedCategory(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tests by patient name or test name..."
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

          {/* Category filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              <SelectItem value="pathology">Pathology</SelectItem>
              <SelectItem value="radiology">Radiology</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters */}
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {/* Active filters display */}
      {(searchTerm || startDate || endDate || selectedCategory) && (
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
          {selectedCategory && (
            <Badge variant="outline" className="px-2 py-1 rounded-full">
              Category: {selectedCategory}
              <button
                className="ml-2 hover:text-destructive"
                onClick={() => setSelectedCategory(undefined)}
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

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
          <Tabs defaultValue="pending" value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "completed")}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                Pending
                <Badge variant="secondary" className="rounded-full px-2">
                  {filteredPendingTests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                Completed
                <Badge variant="secondary" className="rounded-full px-2">
                  {filteredCompletedTests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <PendingTestsList 
                tests={filteredPendingTests} 
                onSelectTest={handleSelectTest} 
              />
            </TabsContent>
            <TabsContent value="completed">
              <CompletedTestsList tests={filteredCompletedTests} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabTestsTab;
