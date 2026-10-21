"use client";

import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: Strict Anti-Vibe-Coding (Crisp 2px/4px radius, 0px shadow at rest, 120ms micro-transition)
    const baseStyles =
      "inline-flex items-center justify-center font-medium select-none cursor-pointer border transition-colors duration-120 focus:outline-none focus:ring-2 focus:ring-[var(--brand-solid)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-[var(--radius-sm)] gap-1.5",
      md: "h-10 px-4 text-sm rounded-[var(--radius-md)] gap-2",
      lg: "h-12 px-6 text-base rounded-[var(--radius-md)] gap-2.5", // 48px touch target for POS
    };

    const variantStyles = {
      primary:
        "bg-[var(--brand-solid)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-active)] text-white border-transparent",
      secondary:
        "bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] active:bg-[var(--border-medium)] text-[var(--text-primary)] border-[var(--border-subtle)]",
      outline:
        "bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] border-[var(--border-medium)]",
      danger:
        "bg-[var(--status-critical-text)] hover:opacity-90 active:opacity-100 text-white border-transparent",
      ghost:
        "bg-transparent hover:bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border-transparent",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
