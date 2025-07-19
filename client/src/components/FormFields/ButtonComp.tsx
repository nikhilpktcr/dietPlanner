import React from "react";
import {IButtonProps} from "../../interface/interface"


const Button: React.FC<IButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...rest
}) => {
  const baseStyles =
    "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles =
    variant === "primary"
      ? "bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-700"
      : variant === "secondary"
      ? "gray-400 text-gray-900 hover:bg-gray-500 focus:ring-gray-600"
      :variant==="danger"
      ? "bg-red-800 text-white hover:bg-red-900 focus:ring-red-700"
      :"bg-green-800 hover:bg-green-900 text-white focus:ring-green-700"

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
