
import { Bell, Scan, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Scan className="h-4 w-4" />
          <span>Scan Prescription</span>
        </Button>
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <span className="text-sm font-medium">Eqadmin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
