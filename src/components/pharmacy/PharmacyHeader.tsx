
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PharmacyHeaderProps {
  date: Date;
  setDate: (date: Date) => void;
}

const PharmacyHeader = ({ date, setDate }: PharmacyHeaderProps) => {
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
          <Select>
            <SelectTrigger id="customer" className="h-9">
              <SelectValue placeholder="--Select--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="jane">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 flex flex-col">
          <label htmlFor="address" className="text-xs mb-1 font-medium">Mob., Address</label>
          <Input id="address" placeholder="Enter mobile or address" className="h-9" />
        </div>
        
        <div className="col-span-1 flex flex-col">
          <label htmlFor="invoice-number" className="text-xs mb-1 font-medium">Invoice Number</label>
          <div className="grid grid-cols-4 gap-1">
            <Input id="invoice-number" value="31-03-2024" readOnly className="col-span-3 h-9" />
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
