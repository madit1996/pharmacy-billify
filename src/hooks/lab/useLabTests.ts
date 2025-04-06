
import { useState } from "react";
import { LabTest, LabTestStatus, WorkflowHistoryItem } from "@/types/lab-tests";
import { initialPendingTests, initialCompletedTests } from "@/contexts/lab/LabInitialData";
import { useToast } from "@/hooks/use-toast";

// Add some home collection sample data to initial tests
const enhancedInitialPendingTests = initialPendingTests.map((test, index) => {
  // Add home collection to first 2 tests for demonstration
  if (index < 2) {
    return {
      ...test,
      isHomeCollection: true,
      collectionAddress: "123 Patient Home St, Medical City, MC 12345",
      collectionDateTime: new Date(new Date().setDate(new Date().getDate() + 1)),
      collectionNotes: "Patient prefers morning collection, has a dog in the house.",
      workflowHistory: [
        {
          fromStatus: 'pending' as LabTestStatus,
          toStatus: 'pending' as LabTestStatus,
          timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
          notes: "Home collection scheduled",
          performedBy: "R5",
          performerName: "David Wilson"
        }
      ]
    };
  }
  
  // Add workflow history to other tests
  if (!test.workflowHistory) {
    return {
      ...test,
      workflowHistory: [
        {
          fromStatus: 'pending' as LabTestStatus,
          toStatus: 'pending' as LabTestStatus,
          timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
          notes: "Test ordered by doctor",
          performedBy: "D1",
          performerName: "Dr. James Wilson"
        }
      ]
    };
  }
  
  return test;
});

export function useLabTests() {
  const [pendingTests, setPendingTests] = useState<LabTest[]>(enhancedInitialPendingTests);
  const [completedTests, setCompletedTests] = useState<LabTest[]>(initialCompletedTests);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const { toast } = useToast();

  const handleSelectTest = (test: LabTest | null) => {
    setSelectedTest(test);
  };

  const handleUploadResult = (testId: string, resultFile: File) => {
    const testToUpdate = pendingTests.find(test => test.id === testId);
    
    if (!testToUpdate) return;
    
    const fakeResultUrl = `https://example.com/results/${testId}.pdf`;
    
    const updatedTest: LabTest = {
      ...testToUpdate,
      status: "completed" as LabTestStatus,
      completedDate: new Date(),
      resultUrl: fakeResultUrl,
      workflowHistory: [
        ...(testToUpdate.workflowHistory || []),
        {
          fromStatus: testToUpdate.status,
          toStatus: 'completed',
          timestamp: new Date(),
          notes: `Result uploaded: ${resultFile.name}`
        }
      ]
    };
    
    const updatedPendingTests = pendingTests.filter(test => test.id !== testId);
    setPendingTests(updatedPendingTests);
    
    setCompletedTests([...completedTests, updatedTest]);
    
    setSelectedTest(null);
    
    toast({
      title: "Test result uploaded",
      description: `Result for ${testToUpdate.testName} has been uploaded successfully.`,
    });
  };

  const handleCreateReport = (testId: string, reportData: Record<string, any>) => {
    const testToUpdate = pendingTests.find(test => test.id === testId);
    
    if (!testToUpdate) return;
    
    const fakeResultUrl = `https://example.com/reports/${testId}.pdf`;
    
    const updatedTest: LabTest = {
      ...testToUpdate,
      status: "completed" as LabTestStatus,
      completedDate: new Date(),
      resultUrl: fakeResultUrl,
      notes: JSON.stringify(reportData),
      workflowHistory: [
        ...(testToUpdate.workflowHistory || []),
        {
          fromStatus: testToUpdate.status,
          toStatus: 'completed',
          timestamp: new Date(),
          notes: "Report created by lab staff",
          reportingDetails: JSON.stringify(reportData.supportingFiles || [])
        }
      ]
    };
    
    const updatedPendingTests = pendingTests.filter(test => test.id !== testId);
    setPendingTests(updatedPendingTests);
    
    setCompletedTests([...completedTests, updatedTest]);
    
    setSelectedTest(null);
    
    toast({
      title: "Test report created",
      description: `Report for ${testToUpdate.testName} has been created successfully.`,
    });
  };

  const updateTestWorkflow = (
    testId: string, 
    newStatus: string, 
    notes?: string,
    additionalInfo?: Partial<WorkflowHistoryItem>
  ) => {
    const pendingTestIndex = pendingTests.findIndex(test => test.id === testId);
    
    if (pendingTestIndex !== -1) {
      const updatedPendingTests = [...pendingTests];
      const test = updatedPendingTests[pendingTestIndex];
      
      const historyItem: WorkflowHistoryItem = {
        fromStatus: test.status,
        toStatus: newStatus as LabTestStatus,
        timestamp: new Date(),
        notes: notes || `Status changed from ${test.status} to ${newStatus}`,
        ...(additionalInfo || {})
      };
      
      const updatedTest = {
        ...test,
        status: newStatus as LabTestStatus,
        workflowHistory: [
          ...(test.workflowHistory || []),
          historyItem
        ]
      };
      
      // If a representative was assigned, update the main test with it
      if (additionalInfo?.performedBy) {
        updatedTest.representativeId = additionalInfo.performedBy;
      }
      
      // If sample details were provided, update the main test
      if (additionalInfo?.sampleDetails) {
        updatedTest.sampleDetails = additionalInfo.sampleDetails;
      }
      
      // If collection details were provided, update them
      if (additionalInfo?.collectionDetails) {
        updatedTest.collectionNotes = additionalInfo.collectionDetails;
      }
      
      if (newStatus === 'completed' && !updatedTest.completedDate) {
        updatedTest.completedDate = new Date();
        
        setCompletedTests([...completedTests, updatedTest]);
        updatedPendingTests.splice(pendingTestIndex, 1);
        setPendingTests(updatedPendingTests);
      } else if (newStatus !== 'completed') {
        updatedPendingTests[pendingTestIndex] = updatedTest;
        setPendingTests(updatedPendingTests);
      }
      
      toast({
        title: "Test status updated",
        description: `Test ${test.testName} status updated to ${newStatus}`,
      });
      
      return;
    }
    
    const completedTestIndex = completedTests.findIndex(test => test.id === testId);
    
    if (completedTestIndex !== -1) {
      const updatedCompletedTests = [...completedTests];
      const test = updatedCompletedTests[completedTestIndex];
      
      const historyItem: WorkflowHistoryItem = {
        fromStatus: test.status,
        toStatus: newStatus as LabTestStatus,
        timestamp: new Date(),
        notes: notes || `Status changed from ${test.status} to ${newStatus}`,
        ...(additionalInfo || {})
      };
      
      if (newStatus !== 'completed') {
        const updatedTest = {
          ...test,
          status: newStatus as LabTestStatus,
          completedDate: undefined,
          workflowHistory: [
            ...(test.workflowHistory || []),
            historyItem
          ]
        };
        
        // If a representative was assigned, update the main test with it
        if (additionalInfo?.performedBy) {
          updatedTest.representativeId = additionalInfo.performedBy;
        }
        
        // If sample details were provided, update the main test
        if (additionalInfo?.sampleDetails) {
          updatedTest.sampleDetails = additionalInfo.sampleDetails;
        }
        
        // If collection details were provided, update them
        if (additionalInfo?.collectionDetails) {
          updatedTest.collectionNotes = additionalInfo.collectionDetails;
        }
        
        setPendingTests([...pendingTests, updatedTest]);
        updatedCompletedTests.splice(completedTestIndex, 1);
        setCompletedTests(updatedCompletedTests);
      } else {
        updatedCompletedTests[completedTestIndex] = {
          ...test,
          workflowHistory: [
            ...(test.workflowHistory || []),
            historyItem
          ]
        };
        setCompletedTests(updatedCompletedTests);
      }
      
      toast({
        title: "Test status updated",
        description: `Test ${test.testName} status updated to ${newStatus}`,
      });
    }
  };

  const updateSampleDetails = (testId: string, sampleDetails: string, sampleId?: string) => {
    const pendingTestIndex = pendingTests.findIndex(test => test.id === testId);
    
    if (pendingTestIndex !== -1) {
      const updatedPendingTests = [...pendingTests];
      const test = updatedPendingTests[pendingTestIndex];
      
      updatedPendingTests[pendingTestIndex] = {
        ...test,
        sampleDetails,
        sampleId,
        workflowHistory: [
          ...(test.workflowHistory || []),
          {
            fromStatus: test.status,
            toStatus: test.status,
            timestamp: new Date(),
            notes: "Sample details updated",
            sampleDetails
          }
        ]
      };
      setPendingTests(updatedPendingTests);
      
      toast({
        title: "Sample details updated",
        description: `Sample information updated for ${test.testName}`,
      });
    }
  };

  const setupHomeCollection = (
    testIds: string[],
    collectionDetails: {
      address: string;
      collectionDate: Date;
      notes?: string;
      representativeId?: string;
    }
  ) => {
    const updatedPendingTests = [...pendingTests];
    
    testIds.forEach(testId => {
      const testIndex = updatedPendingTests.findIndex(test => test.id === testId);
      if (testIndex !== -1) {
        const test = updatedPendingTests[testIndex];
        
        updatedPendingTests[testIndex] = {
          ...test,
          isHomeCollection: true,
          collectionAddress: collectionDetails.address,
          collectionDateTime: collectionDetails.collectionDate,
          collectionNotes: collectionDetails.notes,
          collectionRepresentativeId: collectionDetails.representativeId,
          workflowHistory: [
            ...(test.workflowHistory || []),
            {
              fromStatus: test.status,
              toStatus: test.status,
              timestamp: new Date(),
              notes: "Home collection scheduled",
              collectionDetails: collectionDetails.notes,
              performedBy: collectionDetails.representativeId
            }
          ]
        };
      }
    });
    
    setPendingTests(updatedPendingTests);
    
    toast({
      title: "Home collection scheduled",
      description: `Home collection scheduled for ${testIds.length} tests`,
    });
  };

  return {
    pendingTests,
    completedTests,
    selectedTest,
    handleSelectTest,
    handleUploadResult,
    handleCreateReport,
    updateTestWorkflow,
    updateSampleDetails,
    setupHomeCollection,
    setPendingTests
  };
}
