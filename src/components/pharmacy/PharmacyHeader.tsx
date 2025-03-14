
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerDetails } from "@/pages/PharmacyPage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PharmacyHeaderProps {
  date: Date;
  setDate: (date: Date) => void;
  selectedCustomer: CustomerDetails | null;
  onSearchCustomer: (term: string) => void;
  onAddNewCustomer: () => void;
  searchTerm: string;
}

const PharmacyHeader = ({ 
  date, 
  setDate, 
  selectedCustomer, 
  onSearchCustomer, 
  onAddNewCustomer,
  searchTerm
}: PharmacyHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dummy customers for dropdown
  const customers = [
    { id: "C1", name: "Yuda Rahmat" },
    { id: "C2", name: "Aulia Akbar" },
    { id: "C3", name: "Haul Anggara" },
    { id: "C4", name: "Mira Santoso" }
  ];

  const filteredCustomers = searchTerm 
    ? customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : customers;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 flex flex-col">
          <label htmlFor="invoice-type" className="text-xs mb-1 font-medium">TAX INVOICE</label>
          <Select defaultValue="gst">
            <SelectTrigger id="invoice-type" className="h-9">
              <SelectValue placeholder="Select invoice type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gst">GST</SelectItem>
              <SelectItem value="vat">VAT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 flex flex-col">
          <label htmlFor="customer" className="text-xs mb-1 font-medium">Search Customer</label>
          <div className="relative">
            <Input 
              id="customer" 
              placeholder="Search customer" 
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
                  filteredCustomers.map(customer => (
                    <DropdownMenuItem 
                      key={customer.id}
                      onClick={() => {
                        onSearchCustomer(customer.name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {customer.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem onClick={onAddNewCustomer}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add "{searchTerm}" as new customer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="col-span-1 flex flex-col">
          <label htmlFor="address" className="text-xs mb-1 font-medium">Mob., Address</label>
          <Input 
            id="address" 
            placeholder="Enter mobile or address" 
            className="h-9"
            value={selectedCustomer ? `${selectedCustomer.mobile}, ${selectedCustomer.address}` : ""}
            readOnly
          />
        </div>
        
        <div className="col-span-1 flex flex-col">
          <label htmlFor="invoice-number" className="text-xs mb-1 font-medium">Invoice Number</label>
          <div className="grid grid-cols-4 gap-1">
            <Input id="invoice-number" value={`INV-${date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '')}`} readOnly className="col-span-3 h-9" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 p-0">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="col-span-2 flex flex-col">
          <label htmlFor="remarks" className="text-xs mb-1 font-medium">Remark</label>
          <Input id="remarks" placeholder="Enter remarks" className="h-9" />
        </div>
        
        <div className="col-span-2 flex items-end justify-end">
          <div className="relative w-full max-w-sm">
            <Input 
              placeholder="Search Medicine/ Salt" 
              className="pl-9 h-9"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyHeader;
