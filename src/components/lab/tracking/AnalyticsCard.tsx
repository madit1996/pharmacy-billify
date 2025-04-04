
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalyticsCardProps {
  title: string;
  value: number;
  total: number;
  color: 'blue' | 'purple' | 'green' | 'amber';
  icon: ReactNode;
  subtitle?: string;
}

const AnalyticsCard = ({ title, value, total, color, icon, subtitle }: AnalyticsCardProps) => {
  const colorMap = {
    blue: {
      gradient: "bg-gradient-to-br from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-600",
      progressBg: "bg-blue-100",
    },
    purple: {
      gradient: "bg-gradient-to-br from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-600",
      progressBg: "bg-purple-100",
    },
    green: {
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-600",
      progressBg: "bg-green-100",
    },
    amber: {
      gradient: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-600",
      progressBg: "bg-amber-100",
    },
  };
  
  const theme = colorMap[color];
  const percentage = (value / total) * 100;

  return (
    <Card className={theme.gradient}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${theme.textColor}`}>{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
            {subtitle && <p className={`text-xs ${theme.textColor} mt-1`}>{subtitle}</p>}
          </div>
          <div className={`${theme.iconBg} p-2 rounded-full`}>
            {icon}
          </div>
        </div>
        <Progress 
          value={percentage} 
          className={`h-1 mt-4 ${theme.progressBg}`} 
        />
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
