import React from "react";
import { Card } from "./Card";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  gradient?: "blue" | "green" | "purple" | "orange" | "indigo" | "red";
  className?: string;
  headerClassName?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  gradient = "blue",
  className = "",
  headerClassName = "",
}) => {
  const gradientClasses = {
    blue: "bg-gradient-to-r from-blue-600 to-indigo-600",
    green: "bg-gradient-to-r from-green-600 to-emerald-600",
    purple: "bg-gradient-to-r from-indigo-600 to-purple-600",
    orange: "bg-gradient-to-r from-orange-600 to-red-600",
    indigo: "bg-gradient-to-r from-indigo-600 to-purple-600",
    red: "bg-gradient-to-r from-red-600 to-pink-600",
  };

  return (
    <Card className={`bg-white ${className}`}>
      <div
        className={`${gradientClasses[gradient]} px-6 py-4 -mx-6 -mt-6 mb-6 ${headerClassName}`}
      >
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </Card>
  );
};

export default SectionCard;
