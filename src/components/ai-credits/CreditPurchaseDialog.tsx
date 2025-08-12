import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { useUser } from '@/contexts/UserContext';
import { INDIVIDUAL_PRICING_TIERS, ORG_PRICING, GST_RATE, PricingCalculation } from '@/types/ai-credits';
import { useToast } from '@/hooks/use-toast';
import { Coins, Percent, Gift, CreditCard, Building2, Target, Shield } from 'lucide-react';

interface CreditPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditPurchaseDialog({ open, onOpenChange }: CreditPurchaseDialogProps) {
  const { purchaseCredits } = useAiCredits();
  const { user, organization, isOrgAdmin } = useUser();
  const { toast } = useToast();

  const [credits, setCredits] = useState(1000);
  const [purchaseType, setPurchaseType] = useState<'individual' | 'organization'>('individual');
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [calculation, setCalculation] = useState<PricingCalculation | null>(null);

  // Quick pack options - different for individual vs organization
  const individualQuickPacks = [
    { credits: 500, label: 'Starter', popular: false },
    { credits: 1500, label: 'Popular', popular: true },
    { credits: 3500, label: 'Professional', popular: false },
    { credits: 5000, label: 'Premium', popular: false }
  ];

  const organizationQuickPacks = [
    { credits: 8000, label: 'Enterprise Starter', popular: false },
    { credits: 15000, label: 'Enterprise Pro', popular: true },
    { credits: 25000, label: 'Enterprise Premium', popular: false },
    { credits: 50000, label: 'Enterprise Max', popular: false }
  ];

  const quickPacks = purchaseType === 'organization' ? organizationQuickPacks : individualQuickPacks;

  // Calculate pricing in real-time
  useEffect(() => {
    if (credits > 0) {
      calculatePricing();
    }
  }, [credits, purchaseType, couponCode]);

  const calculatePricing = () => {
    let pricePerCredit: number;

    if (purchaseType === 'organization') {
      pricePerCredit = ORG_PRICING.pricePerCredit;
    } else {
      const tier = INDIVIDUAL_PRICING_TIERS.find(t => 
        credits >= t.min && (!t.max || credits <= t.max)
      );
      pricePerCredit = tier?.pricePerCredit || INDIVIDUAL_PRICING_TIERS[INDIVIDUAL_PRICING_TIERS.length - 1].pricePerCredit;
    }

    const subtotal = credits * pricePerCredit;
    let discount = 0;

    // Mock coupon calculation
    if (couponCode.toLowerCase() === 'save10') {
      discount = subtotal * 0.1;
    } else if (couponCode.toLowerCase() === 'flat500') {
      discount = Math.min(500, subtotal);
    }

    const discountedSubtotal = subtotal - discount;
    const gstAmount = discountedSubtotal * GST_RATE;
    const total = discountedSubtotal + gstAmount;

    // Calculate savings vs highest tier
    const baselinePrice = credits * 15; // ₹15 per credit
    const savings = baselinePrice - subtotal;

    setCalculation({
      credits,
      pricePerCredit,
      subtotal,
      gstAmount,
      discount,
      total,
      savings: Math.max(0, savings)
    });
  };

  const getMinimumBuyIn = () => {
    if (purchaseType === 'organization' && organization) {
      return ORG_PRICING.getMinimumBuyIn(organization.doctorCount);
    }
    return 0;
  };

  const handlePurchase = async () => {
    if (purchaseType === 'organization' && credits < getMinimumBuyIn()) {
      toast({
        title: "Minimum Purchase Required",
        description: `Organization purchases require a minimum of ${getMinimumBuyIn().toLocaleString()} credits.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await purchaseCredits(credits, purchaseType, couponCode || undefined);
      toast({
        title: "Purchase Successful",
        description: `${credits.toLocaleString()} credits have been added to your account.`
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const minimumBuyIn = getMinimumBuyIn();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-credits-individual to-credits-organization flex items-center justify-center">
              <Coins className="h-4 w-4 text-white" />
            </div>
            Purchase AI Credits
          </DialogTitle>
          <DialogDescription>
            Buy credits to power your AI-assisted consultations and medical insights.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Purchase Type Selection */}
          {organization && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <Label className="text-base font-semibold">Purchase Type</Label>
              </CardHeader>
              <CardContent>
                <RadioGroup value={purchaseType} onValueChange={(value: 'individual' | 'organization') => setPurchaseType(value)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                    <RadioGroupItem value="individual" id="individual" />
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-credits-individual" />
                      <Label htmlFor="individual" className="cursor-pointer">Individual Credits (Personal use)</Label>
                    </div>
                  </div>
                  {(isOrgAdmin || organization) && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value="organization" id="organization" />
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-credits-organization" />
                        <Label htmlFor="organization" className="cursor-pointer">
                          Organization Credits (Shared pool)
                          {!isOrgAdmin && <Badge variant="secondary" className="ml-2">Admin Only</Badge>}
                        </Label>
                      </div>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Quick Pack Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{purchaseType === 'organization' ? 'Enterprise Packages' : 'Quick Packs'}</CardTitle>
              <CardDescription>
                {purchaseType === 'organization' 
                  ? 'Bulk credit packages designed for organizations'
                  : 'Popular credit packages for individual doctors'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickPacks.map((pack) => (
                  <Button
                    key={pack.credits}
                    variant={credits === pack.credits ? "default" : "outline"}
                    onClick={() => setCredits(pack.credits)}
                    className={`relative flex flex-col h-auto p-4 ${
                      credits === pack.credits 
                        ? 'bg-gradient-to-br from-credits-individual to-credits-organization text-white' 
                        : 'hover:border-primary'
                    }`}
                  >
                    {pack.popular && (
                      <Badge className="absolute -top-2 -right-2 text-xs bg-credits-warning text-credits-warning-foreground">
                        Popular
                      </Badge>
                    )}
                    <span className="font-bold text-lg">{pack.credits.toLocaleString()}</span>
                    <span className="text-xs opacity-80">{pack.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Amount */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="credits">Number of Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="Enter number of credits"
                  className="text-lg"
                />
                {purchaseType === 'organization' && minimumBuyIn > 0 && credits < minimumBuyIn && (
                  <div className="flex items-center gap-2 text-sm text-credits-danger">
                    <Shield className="w-4 h-4" />
                    <span>Minimum organization purchase: {minimumBuyIn.toLocaleString()} credits</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Coupon Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-credits-warning" />
                Coupon Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                />
                <Button variant="outline" size="icon">
                  <Gift className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">Try "SAVE10" for 10% off</Badge>
                <Badge variant="secondary" className="text-xs">Try "FLAT500" for ₹500 discount</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Breakdown */}
          {calculation && (
            <Card className="border-l-4 border-l-credits-success">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-credits-success" />
                  Pricing Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{calculation.credits.toLocaleString()} credits × ₹{calculation.pricePerCredit}</span>
                    <span className="font-medium">₹{calculation.subtotal.toLocaleString()}</span>
                  </div>
                  {calculation.savings > 0 && (
                    <div className="flex justify-between items-center text-credits-success">
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        Tier Savings
                      </span>
                      <span>-₹{calculation.savings.toLocaleString()}</span>
                    </div>
                  )}
                  {calculation.discount > 0 && (
                    <div className="flex justify-between items-center text-credits-success">
                      <span className="flex items-center gap-1">
                        <Gift className="h-3 w-3" />
                        Coupon Discount
                      </span>
                      <span>-₹{calculation.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>₹{calculation.gstAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">₹{calculation.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Purchase Button */}
          <Button 
            onClick={handlePurchase} 
            disabled={isLoading || !calculation || (purchaseType === 'organization' && !isOrgAdmin)}
            size="lg"
            className="w-full bg-gradient-to-r from-credits-individual to-credits-organization hover:opacity-90 text-white text-lg py-6"
          >
            <CreditCard className="mr-3 h-5 w-5" />
            {isLoading ? 'Processing...' : `Purchase for ₹${calculation?.total.toLocaleString() || '0'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}