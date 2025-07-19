import React from "react";

interface StatusIndicatorProps {
  status: string;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  className = "",
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "online":
      case "connected":
        return "bg-green-100 text-green-800";
      case "in active":
      case "inactive":
      case "offline":
        return "bg-yellow-100 text-yellow-800";
      case "deleted":
      case "error":
      case "disconnected":
        return "bg-red-100 text-red-800";
      case "pending":
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDisplayText = (status: string) => {
    switch (status.toLowerCase()) {
      case "in active":
        return "Inactive";
      case "under-weight":
        return "Underweight";
      case "over-weight":
        return "Overweight";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )} ${className}`}
    >
      {getDisplayText(status)}
    </span>
  );
};

export default StatusIndicator;
