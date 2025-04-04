
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LabCustomer } from "@/types/lab-types";

interface TestFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPatient: string;
  setFilterPatient: (patientId: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterHomeCollection: boolean | null;
  setFilterHomeCollection: (isHomeCollection: boolean | null) => void;
  patients: { key: string; name: string }[];
}

const TestFilters = ({
  searchQuery,
  setSearchQuery,
  filterPatient,
  setFilterPatient,
  filterStatus,
  setFilterStatus,
  filterHomeCollection,
  setFilterHomeCollection,
  patients
}: TestFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by patient name or test..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Select value={filterPatient} onValueChange={setFilterPatient}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by patient" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-patients">All Patients</SelectItem>
          {patients.map((patient) => (
            <SelectItem key={patient.key} value={patient.key}>
              {patient.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="sampling">Sampling</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="reporting">Reporting</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      
      <Select 
        value={filterHomeCollection === null ? "all" : filterHomeCollection ? "home" : "lab"} 
        onValueChange={(value) => {
          if (value === "all") setFilterHomeCollection(null);
          else if (value === "home") setFilterHomeCollection(true);
          else setFilterHomeCollection(false);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Collection type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Collections</SelectItem>
          <SelectItem value="home">Home Collection</SelectItem>
          <SelectItem value="lab">Lab Collection</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TestFilters;
