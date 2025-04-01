
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LabTest } from "@/types/lab-tests";
import { useToast } from "@/hooks/use-toast";

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
        <div className="p-4 bg-gray-50 rounded-md mb-4">
          <h3 className="font-medium text-gray-700 mb-1">Patient: {test.patientName}</h3>
          <p className="text-sm text-gray-500">Test: {test.testName}</p>
        </div>
        
        {template.fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <Label htmlFor={field.name} className="flex justify-between">
              <span>{field.label}</span>
              {field.unit && <span className="text-gray-500 text-sm">{field.unit}</span>}
            </Label>
            
            {field.type === "text" && (
              <Input
                id={field.name}
                value={reportData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            
            {field.type === "number" && (
              <Input
                id={field.name}
                type="number"
                value={reportData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                step={field.step || "any"}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            
            {field.type === "select" && field.options && (
              <Select 
                value={reportData[field.name] || ""} 
                onValueChange={(value) => handleChange(field.name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {field.reference && (
              <p className="text-xs text-gray-500 mt-1">
                Reference range: {field.reference}
              </p>
            )}
          </div>
        ))}
        
        {template.sections && template.sections.map((section) => (
          <div key={section.name} className="mt-6">
            <h3 className="font-medium border-b pb-2 mb-3">{section.label}</h3>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <Label htmlFor={field.name} className="flex justify-between">
                    <span>{field.label}</span>
                    {field.unit && <span className="text-gray-500 text-sm">{field.unit}</span>}
                  </Label>
                  
                  {field.type === "text" && (
                    <Input
                      id={field.name}
                      value={reportData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === "number" && (
                    <Input
                      id={field.name}
                      type="number"
                      value={reportData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      step={field.step || "any"}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  
                  {field.reference && (
                    <p className="text-xs text-gray-500 mt-1">
                      Reference range: {field.reference}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
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

// Helper function to get the template for a specific test type
function getTestTemplate(testName: string) {
  const normalizedTestName = testName.toLowerCase();
  
  if (normalizedTestName.includes("blood") && normalizedTestName.includes("count")) {
    return testTemplates.completeBloodCount;
  } else if (normalizedTestName.includes("lipid")) {
    return testTemplates.lipidProfile;
  } else if (normalizedTestName.includes("thyroid")) {
    return testTemplates.thyroidFunction;
  } else if (normalizedTestName.includes("liver")) {
    return testTemplates.liverFunction;
  } else {
    return testTemplates.generic;
  }
}

// Test template definitions - these would normally be more extensive and stored elsewhere
const testTemplates = {
  completeBloodCount: {
    name: "cbc",
    displayName: "Complete Blood Count",
    fields: [
      { name: "wbc", label: "White Blood Cell Count", type: "number", unit: "x10^9/L", required: true, reference: "4.0-11.0" },
      { name: "rbc", label: "Red Blood Cell Count", type: "number", unit: "x10^12/L", required: true, reference: "4.5-6.0 (men), 4.0-5.5 (women)" },
      { name: "hemoglobin", label: "Hemoglobin", type: "number", unit: "g/dL", required: true, reference: "13.5-17.5 (men), 12.0-16.0 (women)" },
      { name: "hematocrit", label: "Hematocrit", type: "number", unit: "%", required: true, reference: "40-52 (men), 36-48 (women)" },
      { name: "platelets", label: "Platelet Count", type: "number", unit: "x10^9/L", required: true, reference: "150-450" }
    ],
    sections: [
      {
        name: "differential",
        label: "Differential Count",
        fields: [
          { name: "neutrophils", label: "Neutrophils", type: "number", unit: "%", required: true, reference: "40-75" },
          { name: "lymphocytes", label: "Lymphocytes", type: "number", unit: "%", required: true, reference: "20-45" },
          { name: "monocytes", label: "Monocytes", type: "number", unit: "%", required: true, reference: "2-10" },
          { name: "eosinophils", label: "Eosinophils", type: "number", unit: "%", required: true, reference: "1-6" },
          { name: "basophils", label: "Basophils", type: "number", unit: "%", required: true, reference: "0-1" }
        ]
      }
    ]
  },
  lipidProfile: {
    name: "lipid",
    displayName: "Lipid Profile",
    fields: [
      { name: "total_cholesterol", label: "Total Cholesterol", type: "number", unit: "mg/dL", required: true, reference: "<200" },
      { name: "triglycerides", label: "Triglycerides", type: "number", unit: "mg/dL", required: true, reference: "<150" },
      { name: "hdl", label: "HDL Cholesterol", type: "number", unit: "mg/dL", required: true, reference: ">40 (men), >50 (women)" },
      { name: "ldl", label: "LDL Cholesterol", type: "number", unit: "mg/dL", required: true, reference: "<100" },
      { name: "risk_ratio", label: "Total Cholesterol/HDL Ratio", type: "number", required: false, reference: "<5.0" }
    ]
  },
  thyroidFunction: {
    name: "thyroid",
    displayName: "Thyroid Function Test",
    fields: [
      { name: "tsh", label: "Thyroid Stimulating Hormone (TSH)", type: "number", unit: "mIU/L", required: true, reference: "0.4-4.0" },
      { name: "t4", label: "Thyroxine (T4)", type: "number", unit: "µg/dL", required: true, reference: "4.5-11.2" },
      { name: "t3", label: "Triiodothyronine (T3)", type: "number", unit: "ng/dL", required: true, reference: "80-200" },
      { name: "ft4", label: "Free T4", type: "number", unit: "ng/dL", required: false, reference: "0.8-1.8" }
    ]
  },
  liverFunction: {
    name: "liver",
    displayName: "Liver Function Test",
    fields: [
      { name: "alt", label: "Alanine Transaminase (ALT)", type: "number", unit: "U/L", required: true, reference: "7-56" },
      { name: "ast", label: "Aspartate Transaminase (AST)", type: "number", unit: "U/L", required: true, reference: "5-40" },
      { name: "alp", label: "Alkaline Phosphatase (ALP)", type: "number", unit: "U/L", required: true, reference: "44-147" },
      { name: "ggt", label: "Gamma-Glutamyl Transferase (GGT)", type: "number", unit: "U/L", required: true, reference: "<50 (men), <32 (women)" },
      { name: "bilirubin_total", label: "Total Bilirubin", type: "number", unit: "mg/dL", required: true, reference: "0.1-1.2" },
      { name: "bilirubin_direct", label: "Direct Bilirubin", type: "number", unit: "mg/dL", required: false, reference: "<0.3" },
      { name: "albumin", label: "Albumin", type: "number", unit: "g/dL", required: true, reference: "3.5-5.0" }
    ]
  },
  generic: {
    name: "generic",
    displayName: "Laboratory Test",
    fields: [
      { name: "result", label: "Test Result", type: "text", required: true },
      { name: "comments", label: "Comments", type: "text", required: false }
    ]
  }
};

export default TestReportForm;
