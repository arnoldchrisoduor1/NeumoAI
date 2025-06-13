import React from "react";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  type = "submit",
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Using CSS variables
  const variantClasses = {
    primary: "bg-[color:var(--color-primary)] text-black hover:bg-[color:var(--color-primary)]/90 focus:ring-[color:var(--color-primary)] disabled:opacity-50 border",
    secondary: "bg-[color:var(--color-gray)] text-white hover:bg-[color:var(--color-gray)]/80 focus:ring-[color:var(--color-gray)] disabled:opacity-50",
    outline: "bg-transparent border border-[color:var(--color-primary)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 focus:ring-[color:var(--color-primary)] disabled:opacity-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {title}
    </button>
  );
};

export default Button;