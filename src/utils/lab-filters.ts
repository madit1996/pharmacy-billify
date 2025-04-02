
import { LabTest } from "@/types/lab-tests";

// Filter tests based on search, dates, and category
export const filterTests = (
  tests: LabTest[], 
  searchTerm: string, 
  startDate: Date | undefined, 
  endDate: Date | undefined,
  selectedCategory: string | undefined
) => {
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
