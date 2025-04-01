
import { TestSection as TestSectionType } from "@/types/test-templates";
import TestField from "./TestField";

interface TestSectionProps {
  section: TestSectionType;
  reportData: Record<string, any>;
  onFieldChange: (fieldName: string, value: string) => void;
}

const TestSection = ({ section, reportData, onFieldChange }: TestSectionProps) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium border-b pb-2 mb-3">{section.label}</h3>
      <div className="space-y-4">
        {section.fields.map((field) => (
          <TestField 
            key={field.name}
            field={field}
            value={reportData[field.name] || ""}
            onChange={(value) => onFieldChange(field.name, value)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestSection;
