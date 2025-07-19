import React from "react";
import { Card } from "./Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "red" | "purple" | "orange" | "indigo";
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  color = "blue",
  icon,
  className = "",
}) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    indigo: "text-indigo-600",
  };

  return (
    <Card className={`bg-white ${className}`}>
      <div className="text-center">
        {icon && <div className="flex justify-center mb-2">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
};

export default StatsCard;
