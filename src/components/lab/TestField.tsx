
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestField as TestFieldType } from "@/types/test-templates";

interface TestFieldProps {
  field: TestFieldType;
  value: string;
  onChange: (value: string) => void;
}

const TestField = ({ field, value, onChange }: TestFieldProps) => {
  // Render different field types
  switch (field.type) {
    case "text":
    case "number":
      return (
        <div className="space-y-1">
          <Label htmlFor={field.name} className="flex justify-between">
            <span>{field.label}{field.required ? " *" : ""}</span>
            {field.unit && <span className="text-gray-500 text-xs">{field.unit}</span>}
          </Label>
          <Input 
            id={field.name}
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            step={field.type === "number" ? field.step : undefined}
            required={field.required}
          />
          {field.reference && (
            <p className="text-xs text-muted-foreground">Ref: {field.reference}</p>
          )}
        </div>
      );
      
    case "textarea":
      return (
        <div className="space-y-1">
          <Label htmlFor={field.name} className="flex justify-between">
            {field.label}{field.required ? " *" : ""}
          </Label>
          <Textarea
            id={field.name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            required={field.required}
          />
        </div>
      );
      
    case "select":
      return (
        <div className="space-y-1">
          <Label htmlFor={field.name} className="flex justify-between">
            {field.label}{field.required ? " *" : ""}
          </Label>
          <Select
            value={value}
            onValueChange={onChange}
          >
            <SelectTrigger id={field.name}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {field.options && field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
      
    default:
      return null;
  }
};

export default TestField;
