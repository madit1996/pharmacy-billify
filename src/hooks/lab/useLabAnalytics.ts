
import { LabTest, WorkflowHistoryItem } from "@/types/lab-tests";
import { RepresentativeAnalytics, AcquisitionAnalytics } from "@/contexts/lab/LabContextTypes";
import { useState, useEffect } from "react";

export function useLabAnalytics(pendingTests: LabTest[], completedTests: LabTest[]) {
  const [representativeAnalytics, setRepresentativeAnalytics] = useState<RepresentativeAnalytics[]>([]);
  const [acquisitionAnalytics, setAcquisitionAnalytics] = useState<AcquisitionAnalytics>({
    walkIn: 0,
    homeCollection: 0,
    online: 0,
    referral: 0
  });

  useEffect(() => {
    // Combine all tests for analysis
    const allTests = [...pendingTests, ...completedTests];
    
    // Calculate representative analytics
    calculateRepresentativeAnalytics(allTests);
    
    // Calculate acquisition analytics
    calculateAcquisitionAnalytics(allTests);
  }, [pendingTests, completedTests]);

  const calculateRepresentativeAnalytics = (tests: LabTest[]) => {
    const repMap = new Map<string, RepresentativeAnalytics>();

    // Process all workflow history items
    tests.forEach(test => {
      if (!test.workflowHistory) return;

      test.workflowHistory.forEach(historyItem => {
        if (!historyItem.performedBy || !historyItem.performerName) return;

        const repId = historyItem.performedBy;
        const repName = historyItem.performerName;
        
        if (!repMap.has(repId)) {
          repMap.set(repId, {
            representativeId: repId,
            representativeName: repName,
            testsHandled: 0,
            stepsCompleted: 0,
            efficiency: 0,
            specialties: {}
          });
        }
        
        const repData = repMap.get(repId)!;
        repData.stepsCompleted += 1;
        
        // Count unique tests handled
        if (!tests.some(t => 
          t.id === test.id && 
          t.workflowHistory?.some(h => 
            h.performedBy === repId && 
            h !== historyItem
          )
        )) {
          repData.testsHandled += 1;
        }
        
        // Track specialties (test categories)
        if (test.category) {
          repData.specialties[test.category] = (repData.specialties[test.category] || 0) + 1;
        }
        
        // Update efficiency (average processing time - placeholder logic)
        // In a real app, would calculate time between status changes
        repData.efficiency = Math.round(repData.stepsCompleted / repData.testsHandled * 100) / 100;
      });
    });
    
    setRepresentativeAnalytics(Array.from(repMap.values()));
  };

  const calculateAcquisitionAnalytics = (tests: LabTest[]) => {
    const analytics: AcquisitionAnalytics = {
      walkIn: 0,
      homeCollection: 0,
      online: 0,
      referral: 0
    };
    
    tests.forEach(test => {
      if (test.isHomeCollection) {
        analytics.homeCollection += 1;
      } else if (test.referralId) {
        analytics.referral += 1;
      } else {
        // For demo purposes, randomly assign as walk-in or online
        // In a real app, this would come from actual data
        const isOnline = test.id.charCodeAt(0) % 2 === 0;
        if (isOnline) {
          analytics.online += 1;
        } else {
          analytics.walkIn += 1;
        }
      }
    });
    
    setAcquisitionAnalytics(analytics);
  };

  const getRepresentativeAnalytics = () => {
    return representativeAnalytics;
  };
  
  const getAcquisitionAnalytics = () => {
    return acquisitionAnalytics;
  };

  return {
    getRepresentativeAnalytics,
    getAcquisitionAnalytics
  };
}
