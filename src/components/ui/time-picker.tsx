
import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePickerProps {
  value?: {
    hours: string;
    minutes: string;
    ampm: 'AM' | 'PM';
  };
  onChange?: (time: { hours: string; minutes: string; ampm: 'AM' | 'PM' }) => void;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({ value, onChange, disabled, className }: TimePickerProps) {
  const [localValue, setLocalValue] = React.useState({
    hours: "09",
    minutes: "00",
    ampm: "AM" as 'AM' | 'PM'
  });

  React.useEffect(() => {
    if (value) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (field: 'hours' | 'minutes' | 'ampm', fieldValue: string) => {
    const newValue = {
      ...localValue,
      [field]: field === 'ampm' ? fieldValue as 'AM' | 'PM' : fieldValue
    };
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className="h-4 w-4 text-gray-500" />
      
      <div className="flex items-center space-x-1">
        <Select 
          value={localValue.hours}
          onValueChange={(value) => handleChange('hours', value)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[4.5rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
              <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                {hour.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span>:</span>
        
        <Select 
          value={localValue.minutes}
          onValueChange={(value) => handleChange('minutes', value)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[4.5rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['00', '15', '30', '45'].map(minute => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={localValue.ampm}
          onValueChange={(value) => handleChange('ampm', value as 'AM' | 'PM')}
          disabled={disabled}
        >
          <SelectTrigger className="w-[4.5rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
