import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  subtle?: boolean;
}

export function Card({
  children,
  subtle = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`border rounded-[var(--radius-md)] ${
        subtle
          ? "bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)]"
          : "bg-[var(--bg-surface)] border-[var(--border-subtle)]"
      } p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-base font-semibold tracking-tight text-[var(--text-primary)] ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}
