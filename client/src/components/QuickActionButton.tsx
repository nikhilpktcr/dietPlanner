import React from "react";
import Button from "./FormFields/ButtonComp";

interface QuickActionButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary" | "confirm" | "danger";
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  onClick,
  variant = "primary",
  icon,
  children,
  className = "",
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={`flex items-center justify-center space-x-2 ${className}`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{children}</span>
    </Button>
  );
};

export default QuickActionButton;
