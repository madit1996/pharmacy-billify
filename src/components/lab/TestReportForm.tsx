
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LabTest } from "@/types/lab-tests";
import { useToast } from "@/hooks/use-toast";
import { getTestTemplate } from "@/types/test-templates";
import TestPatientInfo from "./TestPatientInfo";
import TestField from "./TestField";
import TestSection from "./TestSection";

interface TestReportFormProps {
  test: LabTest;
  onSubmit: (testId: string, reportData: Record<string, any>) => void;
  onCancel: () => void;
}

const TestReportForm = ({ test, onSubmit, onCancel }: TestReportFormProps) => {
  const [reportData, setReportData] = useState<Record<string, any>>({});
  const { toast } = useToast();
  
  // Get the appropriate template based on the test name
  const template = getTestTemplate(test.testName);
  
  const handleChange = (fieldName: string, value: string) => {
    setReportData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all required fields have values
    const missingFields = template.fields
      .filter(field => field.required && !reportData[field.name])
      .map(field => field.label);
    
    // Check section fields too if they exist
    if (template.sections) {
      template.sections.forEach(section => {
        section.fields
          .filter(field => field.required && !reportData[field.name])
          .forEach(field => missingFields.push(field.label));
      });
    }
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(test.id, reportData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <TestPatientInfo test={test} />
        
        {/* Main fields */}
        {template.fields.map((field) => (
          <TestField
            key={field.name}
            field={field}
            value={reportData[field.name] || ""}
            onChange={(value) => handleChange(field.name, value)}
          />
        ))}
        
        {/* Sections */}
        {template.sections && template.sections.map((section) => (
          <TestSection
            key={section.name}
            section={section}
            reportData={reportData}
            onFieldChange={handleChange}
          />
        ))}
        
        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Report</Button>
        </div>
      </div>
    </form>
  );
};

export default TestReportForm;
