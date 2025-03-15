
import { useState } from "react";
import { User, Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LabCustomer } from "@/types/lab-types";

interface CustomerSearchProps {
  customers: LabCustomer[];
  selectedCustomer: LabCustomer | null;
  onSelectCustomer: (customer: LabCustomer) => void;
  onAddNewCustomer: () => void;
  searchTerm: string;
  onSearchCustomer: (term: string) => void;
}

const CustomerSearch = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddNewCustomer,
  searchTerm,
  onSearchCustomer
}: CustomerSearchProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCustomers = searchTerm 
    ? customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : customers;

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="customer" className="text-xs mb-1 font-medium block">Search Patient</label>
        <div className="relative">
          <Input 
            id="customer" 
            placeholder="Search patient" 
            className="h-9 pr-10"
            value={searchTerm}
            onChange={(e) => onSearchCustomer(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
          />
          <DropdownMenu open={isDropdownOpen && searchTerm.length > 0} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[calc(100%-20px)]">
              {filteredCustomers.length > 0 ? (
                <>
                  {filteredCustomers.map(customer => (
                    <DropdownMenuItem 
                      key={customer.id}
                      onClick={() => {
                        onSelectCustomer(customer);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {customer.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onClick={() => {
                    onAddNewCustomer();
                    setIsDropdownOpen(false);
                  }}>
                    <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                    Add "{searchTerm}" as new patient
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => {
                  onAddNewCustomer();
                  setIsDropdownOpen(false);
                }}>
                  <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                  Add "{searchTerm}" as new patient
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {selectedCustomer && (
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium">{selectedCustomer.name}</span>
          </div>
          <div className="text-xs text-gray-500">
            Mobile: {selectedCustomer.mobile}
          </div>
          <div className="text-xs text-gray-500">
            Address: {selectedCustomer.address}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;
