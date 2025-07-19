import React from "react";

interface SystemStatusItem {
  label: string;
  status:
    | "online"
    | "offline"
    | "connected"
    | "disconnected"
    | "active"
    | "inactive";
  color?: "green" | "blue" | "yellow" | "red";
}

interface SystemStatusCardProps {
  title: string;
  items: SystemStatusItem[];
  className?: string;
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  title,
  items,
  className = "",
}) => {
  const getStatusColor = (status: string, color?: string) => {
    if (color) {
      const colorMap = {
        green: "bg-green-500",
        blue: "bg-blue-500",
        yellow: "bg-yellow-500",
        red: "bg-red-500",
      };
      return colorMap[color] || "bg-green-500";
    }

    switch (status.toLowerCase()) {
      case "online":
      case "connected":
      case "active":
        return "bg-green-500";
      case "offline":
      case "disconnected":
      case "inactive":
        return "bg-red-500";
      case "pending":
      case "processing":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-3 h-3 ${getStatusColor(
                item.status,
                item.color
              )} rounded-full mr-2`}
            ></div>
            <span className="text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatusCard;
