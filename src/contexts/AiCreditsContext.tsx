import React, { createContext, useContext, useState, useEffect } from 'react';
import { CreditBalance, CreditUsage, CreditTransaction, AutoRefillSettings } from '@/types/ai-credits';
import { useUser } from './UserContext';

interface AiCreditsContextType {
  balance: CreditBalance;
  usage: CreditUsage[];
  transactions: CreditTransaction[];
  autoRefillSettings: AutoRefillSettings;
  isLoading: boolean;
  refreshBalance: () => Promise<void>;
  purchaseCredits: (credits: number, type: 'individual' | 'organization', couponCode?: string) => Promise<void>;
  consumeCredits: (credits: number, feature: string, appointmentId?: string) => Promise<void>;
  updateAutoRefill: (settings: AutoRefillSettings) => Promise<void>;
}

const AiCreditsContext = createContext<AiCreditsContextType | undefined>(undefined);

export const useAiCredits = () => {
  const context = useContext(AiCreditsContext);
  if (context === undefined) {
    throw new Error('useAiCredits must be used within an AiCreditsProvider');
  }
  return context;
};

export const AiCreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [balance, setBalance] = useState<CreditBalance>({ free: 0, individual: 0, organization: 0 });
  const [usage, setUsage] = useState<CreditUsage[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [autoRefillSettings, setAutoRefillSettings] = useState<AutoRefillSettings>({
    enabled: false,
    threshold: 100,
    purchaseAmount: 1000
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    if (user) {
      // Mock balance
      setBalance({
        free: user.isElitePlan ? 120 : 0,
        individual: 850,
        organization: user.organizationId ? 2400 : 0
      });

      // Mock usage data
      const mockUsage: CreditUsage[] = [
        {
          id: "usage-1",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          feature: "AI Diagnosis Assistant",
          creditsUsed: 25,
          appointmentId: "apt-123",
          source: "free",
          doctor: "Dr. Sarah Johnson",
          patientName: "John Doe"
        },
        {
          id: "usage-2",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          feature: "Treatment Recommendation",
          creditsUsed: 15,
          appointmentId: "apt-124",
          source: "organization",
          doctor: "Dr. Sarah Johnson",
          patientName: "Jane Smith"
        }
      ];
      setUsage(mockUsage);

      // Mock transactions
      const mockTransactions: CreditTransaction[] = [
        {
          id: "txn-1",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          type: "purchase",
          credits: 1000,
          amount: 13500,
          source: "individual",
          status: "completed",
          invoiceId: "INV-001"
        }
      ];
      setTransactions(mockTransactions);

      setIsLoading(false);
    }
  }, [user]);

  const refreshBalance = async () => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const purchaseCredits = async (credits: number, type: 'individual' | 'organization', couponCode?: string) => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update balance
    setBalance(prev => ({
      ...prev,
      [type]: prev[type] + credits
    }));

    // Add transaction
    const newTransaction: CreditTransaction = {
      id: `txn-${Date.now()}`,
      date: new Date(),
      type: "purchase",
      credits,
      amount: credits * 13.5, // Mock calculation
      source: type,
      status: "completed"
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    setIsLoading(false);
  };

  const consumeCredits = async (credits: number, feature: string, appointmentId?: string) => {
    // Implement consumption logic (free -> org -> individual)
    let remaining = credits;
    const newBalance = { ...balance };

    if (remaining > 0 && newBalance.free > 0) {
      const useFromFree = Math.min(remaining, newBalance.free);
      newBalance.free -= useFromFree;
      remaining -= useFromFree;
    }

    if (remaining > 0 && newBalance.organization > 0) {
      const useFromOrg = Math.min(remaining, newBalance.organization);
      newBalance.organization -= useFromOrg;
      remaining -= useFromOrg;
    }

    if (remaining > 0 && newBalance.individual > 0) {
      const useFromIndividual = Math.min(remaining, newBalance.individual);
      newBalance.individual -= useFromIndividual;
      remaining -= useFromIndividual;
    }

    if (remaining > 0) {
      throw new Error('Insufficient credits');
    }

    setBalance(newBalance);

    // Add usage record
    const newUsage: CreditUsage = {
      id: `usage-${Date.now()}`,
      date: new Date(),
      feature,
      creditsUsed: credits,
      appointmentId,
      source: "free", // Simplified for mock
      doctor: user?.name || "Unknown"
    };
    setUsage(prev => [newUsage, ...prev]);
  };

  const updateAutoRefill = async (settings: AutoRefillSettings) => {
    setAutoRefillSettings(settings);
  };

  return (
    <AiCreditsContext.Provider
      value={{
        balance,
        usage,
        transactions,
        autoRefillSettings,
        isLoading,
        refreshBalance,
        purchaseCredits,
        consumeCredits,
        updateAutoRefill
      }}
    >
      {children}
    </AiCreditsContext.Provider>
  );
};