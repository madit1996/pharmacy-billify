
import { useState } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LabFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  selectedCategory: string | undefined;
  setSelectedCategory: (category: string | undefined) => void;
}

const LabFilters = ({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedCategory,
  setSelectedCategory,
}: LabFiltersProps) => {
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
    </div>
  );
};

export default LabFilters;
