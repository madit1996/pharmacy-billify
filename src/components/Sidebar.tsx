
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Clipboard, 
  Calendar, 
  Users, 
  Pill, 
  FlaskConical, 
  Clock, 
  UserCog,
  BedDouble,
  Droplet,
  Heart,
  Activity,
  Package
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const sidebarItems = [
    { icon: BarChart, label: "Dashboard", path: "/" },
    { icon: Clipboard, label: "Front Desk", path: "/front-desk" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: Pill, label: "Pharmacy", path: "/pharmacy" },
    { icon: FlaskConical, label: "Lab Tests", path: "/lab-tests" },
    { icon: Droplet, label: "Blood Bank", path: "/blood-bank" },
    { icon: BedDouble, label: "IPD", path: "/ipd" },
    { icon: Heart, label: "ICU", path: "/icu" },
    { icon: Activity, label: "OT", path: "/ot" },
    { icon: BedDouble, label: "Bed Management", path: "/bed-management" },
    { icon: Package, label: "Material Store", path: "/material-store" },
    { icon: Clock, label: "Availability", path: "/availability" },
    { icon: UserCog, label: "Human Resource", path: "/human-resource" },
  ];

  return (
    <div className="w-64 h-full bg-pharmacy-secondary flex-shrink-0 overflow-y-auto">
      <div className="flex items-center px-6 py-5 text-white">
        <div className="text-pharmacy-primary text-3xl font-bold">QUEUE</div>
      </div>
      <div className="text-white text-xs px-6 mb-4">Let's plan together!</div>
      
      <nav className="mt-4">
        {sidebarItems.map((item) => {
          const isActive = 
            (item.path === "/" && location.pathname === "/") || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm ${
                isActive 
                  ? "bg-pharmacy-primary text-white" 
                  : "text-white hover:bg-pharmacy-secondary/90"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
