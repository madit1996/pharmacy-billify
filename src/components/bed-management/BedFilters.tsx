
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type WardType = {
  id: number;
  name: string;
  type: string;
  totalBeds: number;
  availableBeds: number;
  beds: any[];
};

type BedFiltersProps = {
  wards: WardType[];
  selectedWard: WardType;
  setSelectedWard: (ward: WardType) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const BedFilters = ({
  wards,
  selectedWard,
  setSelectedWard,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm
}: BedFiltersProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Select 
            value={selectedWard.id.toString()} 
            onValueChange={(value) => setSelectedWard(wards.find(w => w.id === parseInt(value))!)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent>
              {wards.map(ward => (
                <SelectItem key={ward.id} value={ward.id.toString()}>
                  {ward.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List View
            </Button>
          </div>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bed or patient..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-3">
        <Badge variant="outline" className="bg-white">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          Available ({selectedWard.availableBeds})
        </Badge>
        <Badge variant="outline" className="bg-white">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          Occupied ({selectedWard.totalBeds - selectedWard.availableBeds})
        </Badge>
        <Badge variant="outline" className="bg-white flex items-center">
          Total Beds: {selectedWard.totalBeds}
        </Badge>
        <Badge variant="outline" className="bg-white flex items-center">
          Occupancy Rate: {Math.round(((selectedWard.totalBeds - selectedWard.availableBeds) / selectedWard.totalBeds) * 100)}%
        </Badge>
      </div>
    </>
  );
};

export default BedFilters;
