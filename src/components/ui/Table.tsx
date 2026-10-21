import React from "react";

export function Table({
  children,
  className = "",
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto border border-[var(--border-subtle)] rounded-[var(--radius-none)]">
      <table className={`w-full text-left text-sm border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)] ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableHead({
  children,
  className = "",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-10 px-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] align-middle ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableBody({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-[var(--border-subtle)] bg-[var(--bg-surface)] ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`transition-colors duration-120 hover:bg-[var(--bg-surface-hover)] ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  isMono = false,
  className = "",
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { isMono?: boolean }) {
  return (
    <td
      className={`h-12 px-4 align-middle text-[var(--text-primary)] ${
        isMono ? "font-mono-numbers" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
