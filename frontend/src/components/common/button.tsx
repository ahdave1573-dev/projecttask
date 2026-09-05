import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  // Base classes with hover effects, rounded corners, and shadow as per the provided image
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none cursor-pointer";

  // Using our custom predefined generic scale and color variables
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600 shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary-600 shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary-50 shadow-md",
    ghost: "bg-transparent text-current hover:bg-foreground/5 shadow-none",
    danger: "bg-error-600 text-white hover:bg-error-700 shadow-md",
  };

  const sizes = {
    sm: "px-scale-200 py-scale-100 text-sm", // using generic scales we made
    md: "px-scale-400 py-scale-200 text-base", 
    lg: "px-scale-600 py-scale-300 text-lg",
    icon: "p-1.5 w-8 h-8", // Same size for + and Cancel icons
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
