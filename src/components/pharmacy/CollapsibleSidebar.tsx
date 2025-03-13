
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
  side: "left" | "right";
  children: React.ReactNode;
}

const CollapsibleSidebar = ({ 
  collapsed, 
  onToggleCollapse, 
  className = "", 
  side, 
  children 
}: CollapsibleSidebarProps) => {
  return (
    <div className={`${collapsed ? 'w-12' : 'w-60'} h-full flex-shrink-0 transition-width duration-300 ease-in-out ${className}`}>
      <div className="relative h-full">
        {children}
        
        <Button 
          variant="secondary" 
          size="sm" 
          className={`absolute top-4 ${side === 'left' ? '-right-3' : '-left-3'} h-6 w-6 p-0 rounded-full shadow-md z-10`}
          onClick={onToggleCollapse}
        >
          {collapsed 
            ? (side === 'left' ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />)
            : (side === 'left' ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)
          }
        </Button>
      </div>
    </div>
  );
};

export default CollapsibleSidebar;
