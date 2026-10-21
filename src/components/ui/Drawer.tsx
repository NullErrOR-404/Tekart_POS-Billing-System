"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  width = "md",
}: DrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const widthClasses = {
    sm: "md:max-w-md",
    md: "md:max-w-lg",
    lg: "md:max-w-2xl",
    xl: "md:max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#090A0C]/50 backdrop-blur-none"
          />

          {/* Drawer Container (Desktop: Slide from right; Mobile: Slide from bottom) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
            }}
            className={`relative z-10 w-full ${widthClasses[width]} h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] flex flex-col shadow-[var(--shadow-floating)]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] rounded-[var(--radius-sm)] transition-colors duration-120 cursor-pointer"
                aria-label="Close Drawer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6" data-lenis-prevent>
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
