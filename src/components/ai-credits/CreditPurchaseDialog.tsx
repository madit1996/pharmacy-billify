import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { useUser } from '@/contexts/UserContext';
import { INDIVIDUAL_PRICING_TIERS, ORG_PRICING, GST_RATE, PricingCalculation } from '@/types/ai-credits';
import { useToast } from '@/hooks/use-toast';
import { Coins, Percent, Gift, CreditCard } from 'lucide-react';

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

  // Quick pack options
  const quickPacks = [
    { credits: 500, label: 'Starter' },
    { credits: 1500, label: 'Popular' },
    { credits: 3500, label: 'Professional' },
    { credits: 10000, label: 'Enterprise' }
  ];

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Purchase AI Credits
          </DialogTitle>
          <DialogDescription>
            Buy credits to power your AI-assisted consultations and medical insights.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Purchase Type Selection */}
          {organization && (
            <div className="space-y-3">
              <Label>Purchase Type</Label>
              <RadioGroup value={purchaseType} onValueChange={(value: 'individual' | 'organization') => setPurchaseType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">Individual Credits (Personal use)</Label>
                </div>
                {(isOrgAdmin || organization) && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="organization" id="organization" />
                    <Label htmlFor="organization">
                      Organization Credits (Shared pool)
                      {!isOrgAdmin && <Badge variant="secondary" className="ml-2">Admin Only</Badge>}
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>
          )}

          {/* Quick Pack Selection */}
          <div className="space-y-3">
            <Label>Quick Packs</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickPacks.map((pack) => (
                <Button
                  key={pack.credits}
                  variant={credits === pack.credits ? "default" : "outline"}
                  onClick={() => setCredits(pack.credits)}
                  className="flex flex-col h-auto p-3"
                >
                  <span className="font-semibold">{pack.credits.toLocaleString()}</span>
                  <span className="text-xs">{pack.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="credits">Custom Amount</Label>
            <Input
              id="credits"
              type="number"
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
              min="1"
              placeholder="Enter number of credits"
            />
            {purchaseType === 'organization' && minimumBuyIn > 0 && credits < minimumBuyIn && (
              <p className="text-sm text-destructive">
                Minimum organization purchase: {minimumBuyIn.toLocaleString()} credits
              </p>
            )}
          </div>

          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="coupon">Coupon Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
              />
              <Button variant="outline" size="icon">
                <Gift className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Try "SAVE10" for 10% off or "FLAT500" for ₹500 discount
            </p>
          </div>

          {/* Pricing Breakdown */}
          {calculation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>{calculation.credits.toLocaleString()} credits × ₹{calculation.pricePerCredit}</span>
                  <span>₹{calculation.subtotal.toLocaleString()}</span>
                </div>
                {calculation.savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      Tier Savings
                    </span>
                    <span>-₹{calculation.savings.toLocaleString()}</span>
                  </div>
                )}
                {calculation.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      Coupon Discount
                    </span>
                    <span>-₹{calculation.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>₹{calculation.gstAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{calculation.total.toLocaleString()}</span>
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
            className="w-full"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isLoading ? 'Processing...' : `Purchase for ₹${calculation?.total.toLocaleString() || '0'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}