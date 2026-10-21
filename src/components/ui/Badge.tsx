import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "paid" | "pending" | "critical" | "draft" | "brand";
}

export function Badge({
  children,
  variant = "draft",
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    paid: "bg-[var(--status-paid-bg)] text-[var(--status-paid-text)] border-[var(--status-paid-border)]",
    pending: "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] border-[var(--status-pending-border)]",
    critical: "bg-[var(--status-critical-bg)] text-[var(--status-critical-text)] border-[var(--status-critical-border)]",
    draft: "bg-[var(--status-draft-bg)] text-[var(--status-draft-text)] border-[var(--status-draft-border)]",
    brand: "bg-[var(--brand-subtle)] text-[var(--text-brand)] border-[var(--brand-border)]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border rounded-[var(--radius-sm)] ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
