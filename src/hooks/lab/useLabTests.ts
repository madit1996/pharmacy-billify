
import { useState } from "react";
import { LabTest, LabTestStatus, WorkflowHistoryItem } from "@/types/lab-tests";
import { initialPendingTests, initialCompletedTests } from "@/contexts/lab/LabInitialData";
import { useToast } from "@/hooks/use-toast";

export function useLabTests() {
  const [pendingTests, setPendingTests] = useState<LabTest[]>(initialPendingTests);
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
      resultUrl: fakeResultUrl
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
      notes: JSON.stringify(reportData)
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
        notes: notes,
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
        notes: notes,
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
      updatedPendingTests[pendingTestIndex] = {
        ...updatedPendingTests[pendingTestIndex],
        sampleDetails,
        sampleId
      };
      setPendingTests(updatedPendingTests);
      
      toast({
        title: "Sample details updated",
        description: `Sample information updated for ${updatedPendingTests[pendingTestIndex].testName}`,
      });
    }
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
    setPendingTests
  };
}
