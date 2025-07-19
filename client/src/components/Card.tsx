import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  media?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "elevated";
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  description,
  media,
  actions,
  footer,
  children,
  className = "",
  variant = "default",
}) => {
  const baseStyles =
    "rounded-lg overflow-hidden transition-shadow duration-300";
  const variants = {
    default:
      "bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700",
    outlined:
      "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700",
    elevated: "bg-white dark:bg-gray-800 shadow-lg",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {media && <div className="w-full">{media}</div>}

      <div className="p-4 space-y-2">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
        {description && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {description}
          </p>
        )}
        {children}
      </div>

      {actions && (
        <div className="px-4 pb-4 pt-2 flex justify-end gap-2">{actions}</div>
      )}
      {footer && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

{
  /* <Card
    title="Project Apollo"
    subtitle="Updated 2 days ago"
    description="A mission-critical dashboard for managing lunar operations."
    media={<img src="/images/apollo.jpg" alt="Apollo" className="w-full h-48 object-cover" />}
    actions={
        <>
            <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                Edit
            </button>
            <button className="text-red-600 hover:underline text-sm flex items-center gap-1">
                Delete
            </button>
        </>
    }
    footer={<span className="text-xs text-gray-500">Last synced: 24 May 2025</span>}
    variant="elevated"
/> */
}
