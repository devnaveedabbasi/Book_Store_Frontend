import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PrimaryButtonProps {
  Icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  as?: React.ElementType;
  to?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  Icon,
  onClick,
  disabled = false,
  loading = false,
  children,
  type = "button",
  className = "",
  as: Component = "button",
  to,
  ...props
}) => {
  const baseClasses =
    "py-2.5 px-4 rounded-lg font-medium text-white transition-all flex justify-center items-center gap-2";
  const disabledClasses = "bg-gray-400 cursor-not-allowed";
  const activeClasses =
    "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:bg-blue-700 active:scale-95";

  return (
    <Component
      onClick={onClick}
      disabled={disabled || loading}
      type={Component === "button" ? type : undefined}
      className={`${baseClasses} ${
        disabled || loading ? disabledClasses : activeClasses
      } ${className}`}
      to={to}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {children || "Loading..."}
        </div>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </Component>
  );
};

export default PrimaryButton;
