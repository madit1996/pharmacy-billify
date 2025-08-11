import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { useToast } from '@/hooks/use-toast';
import { Settings, CreditCard, AlertTriangle, Shield } from 'lucide-react';

export function AutoRefillSettings() {
  const { autoRefillSettings, updateAutoRefill } = useAiCredits();
  const { toast } = useToast();
  
  const [enabled, setEnabled] = useState(autoRefillSettings.enabled);
  const [threshold, setThreshold] = useState(autoRefillSettings.threshold);
  const [purchaseAmount, setPurchaseAmount] = useState(autoRefillSettings.purchaseAmount);
  const [isLoading, setIsLoading] = useState(false);

  const quickThresholds = [50, 100, 200, 500];
  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateAutoRefill({
        enabled,
        threshold,
        purchaseAmount,
        paymentMethodId: autoRefillSettings.paymentMethodId
      });
      
      toast({
        title: "Settings Updated",
        description: "Auto-refill settings have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Auto-Refill Settings
          </CardTitle>
          <CardDescription>
            Automatically purchase credits when your balance falls below a certain threshold
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Auto-Refill */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Auto-Refill</Label>
              <p className="text-sm text-muted-foreground">
                Automatically purchase credits when running low
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {enabled && (
            <>
              {/* Threshold Setting */}
              <div className="space-y-3">
                <Label>Trigger Threshold</Label>
                <p className="text-sm text-muted-foreground">
                  Auto-refill will trigger when your total credits fall below this amount
                </p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                    placeholder="Enter threshold"
                    className="flex-1"
                  />
                  <div className="flex gap-1">
                    {quickThresholds.map((amount) => (
                      <Button
                        key={amount}
                        variant={threshold === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => setThreshold(amount)}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase Amount Setting */}
              <div className="space-y-3">
                <Label>Purchase Amount</Label>
                <p className="text-sm text-muted-foreground">
                  Number of credits to purchase when auto-refill triggers
                </p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(parseInt(e.target.value) || 0)}
                    placeholder="Enter amount"
                    className="flex-1"
                  />
                  <div className="flex gap-1">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={purchaseAmount === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPurchaseAmount(amount)}
                      >
                        {amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <Select defaultValue="card-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        •••• •••• •••• 1234 (Primary)
                      </div>
                    </SelectItem>
                    <SelectItem value="add-new">+ Add New Payment Method</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Auto-Refill Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    When your total credits fall below <strong>{threshold.toLocaleString()}</strong>, 
                    we'll automatically purchase <strong>{purchaseAmount.toLocaleString()}</strong> credits.
                  </p>
                  <p className="text-muted-foreground">
                    Estimated cost: ₹{(purchaseAmount * 13.5 * 1.18).toLocaleString()} (including GST)
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Save Button */}
          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Auto-refill transactions are secured with 256-bit SSL encryption
          </p>
          <p>
            • You'll receive email notifications for all automatic purchases
          </p>
          <p>
            • You can disable auto-refill at any time without penalties
          </p>
          <p>
            • Failed transactions will be retried once before sending an alert
          </p>
        </CardContent>
      </Card>
    </div>
  );
}