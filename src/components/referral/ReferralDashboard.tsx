import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  Sparkles,
  QrCode,
  Target,
  Zap,
  Lock,
  ChevronDown,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Referral {
  id: string;
  doctorName: string;
  status: 'invited' | 'joined' | 'onboarded';
  freeMonthEarned: boolean;
  hospitalName: string;
  inviteDate: string;
  onboardedDate?: string;
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
      inviteDate: "2024-05-15",
      onboardedDate: "2024-05-22"
    },
    {
      id: "2", 
      doctorName: "Dr. Rajesh Kumar",
      status: "onboarded",
      freeMonthEarned: true,
      hospitalName: "Metro Medical Center",
      inviteDate: "2024-05-20",
      onboardedDate: "2024-05-28"
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

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const referralLink = "https://equeue.app/ref/DOC12345";
  const currentReferrals = 4;
  const totalSlots = 12;
  const progressPercentage = (currentReferrals / totalSlots) * 100;
  const completedReferrals = referrals.filter(r => r.status === 'onboarded').length;
  const totalMonthsEarned = completedReferrals;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "🎉 Link copied!",
      description: "Your referral link has been copied to clipboard",
    });
  };

  const shareWhatsApp = () => {
    const message = `🌟 Hey! I'm using Equeue for my hospital's OPD management and it's revolutionizing patient care! 

🚀 Smart queue management
📱 Digital appointments 
💡 Real-time analytics
⚡ Zero wait times

Join me and transform your OPD: ${referralLink}

Let's build smarter healthcare together! 🏥✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareSMS = () => {
    const message = `Transform your OPD with Equeue! Smart queue management that eliminates wait times. Join me: ${referralLink}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = "🏥 Transform Your OPD with Equeue - Join Me!";
    const body = `Hi there!

I've been using Equeue for my hospital's OPD management and it has completely transformed how we handle patient queues and appointments.

✨ Key benefits I'm seeing:
• Zero patient wait times
• Smart queue management
• Real-time analytics dashboard
• Digital appointment system
• Better patient satisfaction

I think you'd find tremendous value in this system for your practice too. 

Check it out and join me: ${referralLink}

Let's revolutionize healthcare together!

Best regards`;
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'joined':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'invited':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const renderProgressSlots = () => {
    const slots = [];
    for (let i = 0; i < totalSlots; i++) {
      const isCompleted = i < currentReferrals;
      const isMilestone = i === 6 || i === 11; // 7th and 12th slots (0-indexed)
      const isNext = i === currentReferrals;
      
      slots.push(
        <div
          key={i}
          className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            isCompleted 
              ? 'bg-gradient-to-r from-green-400 to-green-600 border-green-500 text-white shadow-lg' 
              : isNext
              ? 'bg-blue-100 border-blue-400 text-blue-600 animate-pulse'
              : 'bg-gray-100 border-gray-300 text-gray-400'
          }`}
        >
          {isCompleted ? (
            isMilestone ? <Gift className="h-4 w-4" /> : <Check className="h-3 w-3" />
          ) : (
            i + 1
          )}
          {isMilestone && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
              {i === 6 ? '🎁 ₹500' : '🎉 +2 Months'}
            </div>
          )}
          {isNext && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
              You're here!
            </div>
          )}
        </div>
      );
    }
    return slots;
  };

  const getMotivationalMessage = () => {
    if (currentReferrals >= 12) {
      return "🎊 Amazing! You've completed all referrals! You're a true Equeue champion!";
    } else if (currentReferrals >= 7) {
      return `🎉 Awesome! You've unlocked ₹500 Amazon voucher! Just ${12 - currentReferrals} more for bonus months!`;
    } else {
      return `🎯 You're just ${7 - currentReferrals} more away from unlocking ₹500 Amazon voucher!`;
    }
  };

  const getRemainingToNextReward = () => {
    if (currentReferrals < 7) {
      return 7 - currentReferrals;
    } else if (currentReferrals < 12) {
      return 12 - currentReferrals;
    }
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Referral Dashboard
          </h1>
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-xl text-gray-600 font-medium">Build smarter OPDs. Grow together. 🚀</p>
        
        {/* New recurring reward highlight */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-lg px-6 py-3 mx-auto max-w-2xl">
          <p className="text-lg font-semibold text-blue-700">
            🎁 You earn 1 month of Equeue Elite for every successful referral!
          </p>
        </div>
      </div>

      {/* Progress Tracker */}
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-700">Referral Progress Tracker</h2>
            </div>
            
            <div className="text-3xl font-bold text-purple-700">
              🎉 {currentReferrals} of {totalSlots} referrals completed!
            </div>
            
            {/* Progress Slots */}
            <div className="flex flex-wrap justify-center gap-3 py-4">
              {renderProgressSlots()}
            </div>
            
            <div className="text-lg text-blue-600 font-semibold">
              {getMotivationalMessage()}
            </div>

            {getRemainingToNextReward() > 0 && (
              <div className="text-base text-purple-600 font-medium">
                💡 You're just {getRemainingToNextReward()} referrals away from your next reward!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reward Summary & Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <div className="text-sm text-green-700 font-medium">Your Progress</div>
            <div className="space-y-1 mt-2">
              <div className="text-lg font-bold text-green-800">Total Referrals: {currentReferrals}</div>
              <div className="text-sm text-green-700">Total Months Earned: {totalMonthsEarned}</div>
              <div className="text-sm text-green-700">
                Total Bonus Rewards: {currentReferrals >= 7 ? '₹500' : '₹0'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Cards */}
        <Card className={currentReferrals >= 7 ? "border-yellow-300 bg-yellow-50" : "border-gray-200 relative"}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              {currentReferrals < 7 && <Lock className="h-4 w-4 text-gray-400" />}
              <Gift className={`h-8 w-8 ${currentReferrals >= 7 ? "text-yellow-600" : "text-gray-400"}`} />
            </div>
            <div className="font-semibold text-lg">7 Referrals</div>
            <div className="text-sm text-gray-600">₹500 Amazon Voucher</div>
            {currentReferrals >= 7 ? (
              <Badge className="mt-2 bg-yellow-100 text-yellow-800 animate-pulse">🎉 Unlocked!</Badge>
            ) : (
              <div className="text-xs text-blue-600 mt-2 font-medium">
                You're just {7 - currentReferrals} more away from this reward!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={currentReferrals >= 12 ? "border-purple-300 bg-purple-50" : "border-gray-200 relative"}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              {currentReferrals < 12 && <Lock className="h-4 w-4 text-gray-400" />}
              <Trophy className={`h-8 w-8 ${currentReferrals >= 12 ? "text-purple-600" : "text-gray-400"}`} />
            </div>
            <div className="font-semibold text-lg">12 Referrals</div>
            <div className="text-sm text-gray-600">🎉 10 Months Earned + 2 Bonus = 1 Full Year Free!</div>
            {currentReferrals >= 12 ? (
              <Badge className="mt-2 bg-purple-100 text-purple-800 animate-pulse">🎉 Earned!</Badge>
            ) : (
              <div className="text-xs text-blue-600 mt-2 font-medium">
                Complete your first year of Equeue Elite!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Share2 className="h-6 w-6 text-blue-600" />
            Your Referral Link
            <QrCode className="h-5 w-5 text-gray-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="flex-1 bg-transparent border-none outline-none text-sm font-mono"
            />
            <Button size="sm" onClick={copyToClipboard} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={shareWhatsApp} className="gap-2 bg-green-50 hover:bg-green-100 border-green-200">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" onClick={shareSMS} className="gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200">
              <MessageCircle className="h-4 w-4" />
              SMS
            </Button>
            <Button variant="outline" size="sm" onClick={shareEmail} className="gap-2 bg-purple-50 hover:bg-purple-100 border-purple-200">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>

          <div className="text-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Invite More Doctors
            </Button>
            <p className="text-sm text-gray-600 mt-2">🚀 Help a colleague. Earn rewards together!</p>
          </div>
        </CardContent>
      </Card>

      {/* Top Referrers & Your Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Referrers This Month 🏆
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Dr. A***", "Dr. S***", "Dr. R***"].map((name, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 
                      'bg-gradient-to-r from-amber-600 to-amber-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-800">{name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-lg">{15 - index * 3}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Referrals Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referrals.map((referral) => (
                <Collapsible key={referral.id}>
                  <Card className="border-l-4 border-l-blue-500">
                    <CollapsibleTrigger 
                      className="w-full"
                      onClick={() => toggleCardExpansion(referral.id)}
                    >
                      <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-900">{referral.doctorName}</h4>
                              <p className="text-sm text-gray-600">{referral.hospitalName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(referral.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(referral.status)}
                                  {referral.status}
                                </div>
                              </Badge>
                              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.has(referral.id) ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Month Earned:</span>
                            <span className={referral.freeMonthEarned ? "text-green-600 font-medium" : "text-gray-400"}>
                              {referral.freeMonthEarned ? "+1 Month Earned ✅" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="px-4 pb-4 pt-0 border-t bg-gray-50">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Invited: {new Date(referral.inviteDate).toLocaleDateString()}</span>
                          </div>
                          {referral.onboardedDate && (
                            <div className="flex items-center gap-2 text-green-600">
                              <Check className="h-4 w-4" />
                              <span>Onboarded on {new Date(referral.onboardedDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 italic">
                            💡 Referral reward counted only after onboarding & payment
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Prevention Notice */}
      <Card className="border-amber-300 bg-amber-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
              !
            </div>
            <div>
              <h4 className="font-bold text-amber-800 mb-2">⚠️ Fraud Prevention Notice</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                Referrals are valid only if the doctor joins a <strong>new, verified hospital you haven't referred before</strong>. 
                Each referral must lead to hospital onboarding and payment for the reward to count. Multiple doctors from the same hospital 
                will only count as one referral reward.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
