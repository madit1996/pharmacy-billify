
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Share2, 
  MessageCircle, 
  Mail, 
  Gift, 
  Trophy, 
  Star,
  Check,
  Clock,
  UserPlus,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Referral {
  id: string;
  doctorName: string;
  status: 'invited' | 'joined' | 'onboarded';
  freeMonthEarned: boolean;
  hospitalName: string;
  inviteDate: string;
}

const ReferralDashboard = () => {
  const { toast } = useToast();
  const [referrals] = useState<Referral[]>([
    {
      id: "1",
      doctorName: "Dr. Priya Sharma",
      status: "onboarded",
      freeMonthEarned: true,
      hospitalName: "City Care Hospital",
      inviteDate: "2024-05-15"
    },
    {
      id: "2", 
      doctorName: "Dr. Rajesh Kumar",
      status: "onboarded",
      freeMonthEarned: true,
      hospitalName: "Metro Medical Center",
      inviteDate: "2024-05-20"
    },
    {
      id: "3",
      doctorName: "Dr. Anita Gupta",
      status: "joined",
      freeMonthEarned: false,
      hospitalName: "Green Valley Clinic",
      inviteDate: "2024-05-25"
    },
    {
      id: "4",
      doctorName: "Dr. Vikram Singh",
      status: "invited",
      freeMonthEarned: false,
      hospitalName: "Sunrise Hospital",
      inviteDate: "2024-05-28"
    }
  ]);

  const referralLink = "https://equeue.app/ref/DOC12345";
  const completedReferrals = referrals.filter(r => r.status === 'onboarded').length;
  const totalTarget = 12;
  const progressPercentage = (completedReferrals / totalTarget) * 100;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Your referral link has been copied to clipboard",
    });
  };

  const shareWhatsApp = () => {
    const message = `Hey! I'm using Equeue for my hospital's OPD management and it's amazing! Join me and get started: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareSMS = () => {
    const message = `Check out Equeue for smart OPD management: ${referralLink}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = "Join me on Equeue - Smart OPD Management";
    const body = `Hi!\n\nI've been using Equeue for my hospital's OPD management and it has revolutionized how we handle patient queues and appointments.\n\nI think you'd find it valuable too. Check it out: ${referralLink}\n\nBest regards!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'onboarded':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'joined':
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'invited':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onboarded':
        return 'bg-green-100 text-green-800';
      case 'joined':
        return 'bg-blue-100 text-blue-800';
      case 'invited':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMotivationalMessage = () => {
    const remaining = 5 - completedReferrals;
    if (completedReferrals >= 10) {
      return "🎉 You've mastered referrals! Keep spreading the Equeue love!";
    } else if (completedReferrals >= 5) {
      return `Just ${10 - completedReferrals} more to unlock 3 months bonus Equeue Elite!`;
    } else if (remaining > 0) {
      return `Just ${remaining} more to unlock your ₹500 Amazon voucher!`;
    }
    return "🎁 You've unlocked a ₹500 Amazon voucher!";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Referral Dashboard
          </h1>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-gray-600">Build smarter OPDs. Grow together.</p>
      </div>

      {/* Progress Tracker */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-blue-700">
              🎉 {completedReferrals} of {totalTarget} referrals already completed!
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-sm text-blue-600 font-medium">
              {getMotivationalMessage()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={completedReferrals >= 5 ? "border-green-300 bg-green-50" : "border-gray-200"}>
          <CardContent className="p-4 text-center">
            <Gift className={`h-8 w-8 mx-auto mb-2 ${completedReferrals >= 5 ? "text-green-600" : "text-gray-400"}`} />
            <div className="font-semibold">5 Referrals</div>
            <div className="text-sm text-gray-600">₹500 Amazon Voucher</div>
            {completedReferrals >= 5 && (
              <Badge className="mt-2 bg-green-100 text-green-800">🎁 Unlocked!</Badge>
            )}
          </CardContent>
        </Card>

        <Card className={completedReferrals >= 10 ? "border-purple-300 bg-purple-50" : "border-gray-200"}>
          <CardContent className="p-4 text-center">
            <Trophy className={`h-8 w-8 mx-auto mb-2 ${completedReferrals >= 10 ? "text-purple-600" : "text-gray-400"}`} />
            <div className="font-semibold">10 Referrals</div>
            <div className="text-sm text-gray-600">3 Months Bonus Elite</div>
            {completedReferrals >= 10 && (
              <Badge className="mt-2 bg-purple-100 text-purple-800">🎉 Earned!</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
            <Button size="sm" onClick={copyToClipboard} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={shareWhatsApp} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" onClick={shareSMS} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              SMS
            </Button>
            <Button variant="outline" size="sm" onClick={shareEmail} className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Referrers This Month 🏆
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Dr. A***", "Dr. S***", "Dr. R***"].map((name, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium">{name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{15 - index * 3}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referrals.map((referral) => (
              <Card key={referral.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{referral.doctorName}</h4>
                        <p className="text-sm text-gray-600">{referral.hospitalName}</p>
                      </div>
                      <Badge className={getStatusColor(referral.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(referral.status)}
                          {referral.status}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Free Month Earned:</span>
                      <span className={referral.freeMonthEarned ? "text-green-600" : "text-gray-400"}>
                        {referral.freeMonthEarned ? "✅" : "❌"}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Invited: {new Date(referral.inviteDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fraud Prevention Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
              !
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Fraud Prevention Notice</h4>
              <p className="text-sm text-amber-700">
                Referrals are only valid if the doctor belongs to a new, verified hospital you haven't referred before.
                Each successful referral must result in hospital onboarding and payment to earn your free month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
