import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isMono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      isMono = false,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1 w-full">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`h-11 px-3.5 bg-[var(--bg-surface)] text-[var(--text-primary)] border rounded-[var(--radius-sm)] transition-colors duration-120 placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent ${
            error
              ? "border-[var(--status-critical-text)]"
              : "border-[var(--border-medium)]"
          } ${isMono ? "font-mono-numbers" : ""} ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs text-[var(--status-critical-text)] font-medium">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-[var(--text-tertiary)]">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
