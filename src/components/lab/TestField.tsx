
import { TestField as TestFieldType } from "@/types/test-templates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestFieldProps {
  field: TestFieldType;
  value: string;
  onChange: (value: string) => void;
}

const TestField = ({ field, value, onChange }: TestFieldProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={field.name} className="flex justify-between">
        <span>{field.label}</span>
        {field.unit && <span className="text-gray-500 text-sm">{field.unit}</span>}
      </Label>
      
      {field.type === "text" && (
        <Input
          id={field.name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      )}
      
      {field.type === "number" && (
        <Input
          id={field.name}
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          step={field.step || "any"}
          placeholder={field.placeholder}
          required={field.required}
        />
      )}
      
      {field.type === "select" && field.options && (
        <Select 
          value={value || ""} 
          onValueChange={(newValue) => onChange(newValue)}
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
  );
};

export default TestField;
