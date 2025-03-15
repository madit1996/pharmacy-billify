
import { useState, useEffect } from "react";
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

  // Close dropdown when a customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      setIsDropdownOpen(false);
    }
  }, [selectedCustomer]);

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
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>
          {isDropdownOpen && searchTerm.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
              {filteredCustomers.length > 0 ? (
                <>
                  {filteredCustomers.map(customer => (
                    <div 
                      key={customer.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        onSelectCustomer(customer);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {customer.name}
                    </div>
                  ))}
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t flex items-center text-blue-600"
                    onClick={() => {
                      onAddNewCustomer();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add "{searchTerm}" as new patient
                  </div>
                </>
              ) : (
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-blue-600"
                  onClick={() => {
                    onAddNewCustomer();
                    setIsDropdownOpen(false);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add "{searchTerm}" as new patient
                </div>
              )}
            </div>
          )}
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
