
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReferralDashboard from "@/components/referral/ReferralDashboard";

const ReferralPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-4">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>
      
      <div className="py-6">
        <ReferralDashboard />
      </div>
    </div>
  );
};

export default ReferralPage;
