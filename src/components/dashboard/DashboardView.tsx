"use client";

import React, { useState } from "react";
import Image from "next/image";
import { POSClient } from "@/components/pos/POSClient";
import { motion, AnimatePresence } from "motion/react";

export function UnifiedAppShell({
  initialProducts,
  initialCategories,
  initialCustomers,
}: {
  initialProducts: any[];
  initialCategories: any[];
  initialCustomers: any[];
}) {
  const [activeTab, setActiveTab] = useState<
    | "Dashboard"
    | "POS Billing"
    | "Products"
    | "Inventory"
    | "Categories"
    | "Customers"
    | "Suppliers"
    | "Sales"
    | "Purchases"
    | "Expenses"
    | "Reports"
    | "Settings"
  >("Dashboard");

  const [searchQuery, setSearchQuery] = useState("");
  const [salesTimeframe, setSalesTimeframe] = useState("Last 7 Days");
  const [activeBarIndex, setActiveBarIndex] = useState(6); // 21 Oct active

  // Nav Items configuration with icons
  const navItems = [
    { name: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "POS Billing", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { name: "Inventory", icon: "M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7M4 7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3M4 7h16m-8 4v6m-4-3h8" },
    { name: "Categories", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { name: "Customers", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { name: "Suppliers", icon: "M8 17a5 5 0 01-.916-9.916 5.002 5.002 0 019.832 0A5.002 5.002 0 0116 17m-7-5l3-3m0 0l3 3m-3-3v12" },
    { name: "Sales", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "Purchases", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { name: "Expenses", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { name: "Reports", icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
    { name: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  // Sales Overview bar chart data (15 Oct to 21 Oct)
  const chartData = [
    { date: "15 Oct", height: 28, value: "₹4,200", items: 22 },
    { date: "16 Oct", height: 50, value: "₹7,800", items: 39 },
    { date: "17 Oct", height: 45, value: "₹6,900", items: 34 },
    { date: "18 Oct", height: 72, value: "₹10,800", items: 56 },
    { date: "19 Oct", height: 76, value: "₹11,400", items: 60 },
    { date: "20 Oct", height: 86, value: "₹13,100", items: 71 },
    { date: "21 Oct", height: 80, value: "₹12,480", items: 68 }, // active
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-canvas)]">
      {/* ----------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR (1:1 with Dashboard UI Desktop Reference.png)      */}
      {/* ----------------------------------------------------------------- */}
      <aside className="w-60 xl:w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Official Tekart Brand Logo */}
          <div className="h-16 px-6 flex items-center border-b border-[var(--border-subtle)]">
            <Image
              src="/images/tekart-logo.png"
              alt="TEKART"
              width={160}
              height={40}
              className="h-8 w-auto object-contain cursor-pointer"
              onClick={() => setActiveTab("Dashboard")}
              priority
            />
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name as any)}
                  className={`w-full h-10 px-3.5 rounded-[var(--radius-md)] flex items-center gap-3 text-sm font-semibold transition-colors duration-120 cursor-pointer ${
                    isActive
                      ? "bg-[#EFF6FF] text-[var(--brand-solid)] border border-[#BFDBFE]"
                      : "text-slate-600 hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-[var(--brand-solid)]" : "text-slate-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={isActive ? 2.2 : 1.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Switcher & Support Guide */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-2">
          {/* Main Store Switcher Card */}
          <div className="flex items-center justify-between p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] cursor-pointer hover:bg-[var(--bg-surface-subtle)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-800">Main Store</span>
            </div>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Help & Support Banner */}
          <div className="flex items-center gap-2.5 p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[var(--radius-sm)] cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              ?
            </div>
            <div>
              <span className="block text-xs font-bold text-[var(--brand-solid)]">
                Need Help?
              </span>
              <span className="block text-[10px] text-slate-600">
                View support & guides
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* 2. MAIN APPLICATION CONTENT AREA                                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Global Navigation Bar (Matching 1:1) */}
        <header className="h-16 px-6 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
          {/* Search Box */}
          <div className="w-full max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search product, scan barcode, or enter SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-16 bg-[var(--bg-canvas)] text-sm border border-[var(--border-subtle)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-solid)] placeholder:text-slate-400 font-normal"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <kbd className="absolute right-3 top-2.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-200 rounded">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Right User Bar */}
          <div className="flex items-center gap-4">
            {/* Store Dropdown */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] text-xs font-semibold text-slate-700 cursor-pointer">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Main Store</span>
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 text-slate-600 hover:text-black rounded-full hover:bg-[var(--bg-surface-subtle)] cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* User Avatar & Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)] cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-solid)] text-white font-bold flex items-center justify-center text-sm">
                A
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-[var(--text-primary)] leading-tight">
                  Admin
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  Store Owner
                </span>
              </div>
              <svg className="w-3 h-3 text-slate-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* VIEW ROUTER (In-Place SPA Navigation without Page Reloads)         */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto" data-lenis-prevent>
          {activeTab === "POS Billing" ? (
            <POSClient
              initialProducts={initialProducts}
              initialCategories={initialCategories}
              initialCustomers={initialCustomers}
            />
          ) : (
            /* 1:1 EXACT DASHBOARD VIEW */
            <div className="p-6 xl:p-8 space-y-6 max-w-[1600px] mx-auto">
              {/* Header Title & Date Stamp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl xl:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    Good Morning, <span className="text-[var(--brand-solid)]">Admin</span>
                  </h1>
                  <p className="text-sm text-slate-500 font-normal mt-0.5">
                    Here&apos;s what&apos;s happening at your store today.
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 font-medium flex items-center gap-3">
                  <span>Tue, 21 Oct 2026</span>
                  <span className="font-mono-numbers font-semibold text-slate-700">09:41 AM</span>
                </div>
              </div>

              {/* 4 KPI Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Total Sales */}
                <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-blue-50 border border-blue-100 flex items-center justify-center text-[var(--brand-solid)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Total Sales</span>
                    <span className="block text-2xl font-extrabold text-[var(--text-primary)] font-mono-numbers mt-0.5">
                      ₹12,480
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <span>↑ +18%</span>
                    <span className="text-slate-400 font-normal">from yesterday</span>
                  </div>
                </div>

                {/* KPI 2: Items Sold */}
                <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Items Sold</span>
                    <span className="block text-2xl font-extrabold text-[var(--text-primary)] font-mono-numbers mt-0.5">
                      68
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <span>↗ +12%</span>
                    <span className="text-slate-400 font-normal">from yesterday</span>
                  </div>
                </div>

                {/* KPI 3: Total Customers */}
                <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Total Customers</span>
                    <span className="block text-2xl font-extrabold text-[var(--text-primary)] font-mono-numbers mt-0.5">
                      42
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <span>↗ +20%</span>
                    <span className="text-slate-400 font-normal">from yesterday</span>
                  </div>
                </div>

                {/* KPI 4: Low Stock Items */}
                <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Low Stock Items</span>
                    <span className="block text-2xl font-extrabold text-[var(--text-primary)] font-mono-numbers mt-0.5">
                      6
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-red-600 font-semibold">
                    <span>↓ +50%</span>
                    <span className="text-slate-400 font-normal">need attention</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Sales Overview Chart (60%) + Quick Actions (40%) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Overview (7 Columns) */}
                <div className="lg:col-span-7 bg-[var(--bg-surface)] p-6 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-bold text-[var(--text-primary)]">
                      Sales Overview
                    </h2>
                    <select
                      value={salesTimeframe}
                      onChange={(e) => setSalesTimeframe(e.target.value)}
                      className="text-xs font-semibold px-2.5 py-1 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] text-slate-700 cursor-pointer"
                    >
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Month</option>
                    </select>
                  </div>

                  {/* Bar Chart Container */}
                  <div className="relative h-64 flex items-end justify-between pt-10 px-4">
                    {/* Y Axis Grid lines */}
                    <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
                      <div className="border-b border-slate-100 flex justify-between"><span>₹20K</span></div>
                      <div className="border-b border-slate-100 flex justify-between"><span>₹15K</span></div>
                      <div className="border-b border-slate-100 flex justify-between"><span>₹10K</span></div>
                      <div className="border-b border-slate-100 flex justify-between"><span>₹5K</span></div>
                      <div className="border-b border-slate-200 flex justify-between"><span>0</span></div>
                    </div>

                    {/* Bars */}
                    {chartData.map((bar, i) => {
                      const isActive = activeBarIndex === i;
                      return (
                        <div
                          key={bar.date}
                          onClick={() => setActiveBarIndex(i)}
                          className="flex flex-col items-center gap-2 z-10 cursor-pointer group"
                        >
                          {/* Active Bar Floating Tooltip */}
                          {isActive && (
                            <div className="absolute top-0 transform -translate-x-1/2 left-[88%] bg-[var(--bg-surface)] p-2 rounded border border-[var(--border-subtle)] shadow-sm text-center text-xs">
                              <span className="block text-[10px] text-slate-400">21 Oct 2026</span>
                              <span className="font-extrabold text-[var(--text-primary)]">₹12,480</span>
                              <span className="block text-[10px] text-slate-500">68 items</span>
                            </div>
                          )}

                          <div
                            style={{ height: `${bar.height * 2.2}px` }}
                            className={`w-8 xl:w-10 rounded-t-[var(--radius-sm)] transition-all ${
                              isActive
                                ? "bg-[var(--brand-solid)]"
                                : "bg-blue-300 hover:bg-blue-400"
                            }`}
                          />
                          <span className="text-[11px] font-semibold text-slate-500">
                            {bar.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions (5 Columns) */}
                <div className="lg:col-span-5 bg-[var(--bg-surface)] p-6 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col">
                  <h2 className="text-base font-bold text-[var(--text-primary)] mb-4">
                    Quick Actions
                  </h2>

                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {/* Action 1: Start Billing (POS) - Primary Highlight */}
                    <button
                      onClick={() => setActiveTab("POS Billing")}
                      className="p-4 bg-[var(--brand-solid)] hover:bg-[var(--brand-hover)] text-white rounded-[var(--radius-md)] flex flex-col justify-between text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                          →
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm font-bold">Start Billing (POS)</span>
                        <span className="text-xs text-blue-100">Create a new sale</span>
                      </div>
                    </button>

                    {/* Action 2: Snap & Add */}
                    <button
                      onClick={() => setActiveTab("POS Billing")}
                      className="p-4 bg-[var(--bg-surface-subtle)] hover:bg-slate-200 text-[var(--text-primary)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] flex flex-col justify-between text-left transition-all cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <span className="block text-sm font-bold">Snap & Add</span>
                        <span className="text-xs text-slate-500">Scan product with camera</span>
                      </div>
                    </button>

                    {/* Action 3: Add Product */}
                    <button
                      onClick={() => setActiveTab("Products")}
                      className="p-4 bg-[var(--bg-surface-subtle)] hover:bg-slate-200 text-[var(--text-primary)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] flex flex-col justify-between text-left transition-all cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <div>
                        <span className="block text-sm font-bold">Add Product</span>
                        <span className="text-xs text-slate-500">Create new product</span>
                      </div>
                    </button>

                    {/* Action 4: Update Stock */}
                    <button
                      onClick={() => setActiveTab("Inventory")}
                      className="p-4 bg-[var(--bg-surface-subtle)] hover:bg-slate-200 text-[var(--text-primary)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] flex flex-col justify-between text-left transition-all cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7M4 7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3M4 7h16m-8 4v6m-4-3h8" />
                      </svg>
                      <div>
                        <span className="block text-sm font-bold">Update Stock</span>
                        <span className="text-xs text-slate-500">Adjust inventory</span>
                      </div>
                    </button>

                    {/* Action 5: View Sales */}
                    <button
                      onClick={() => setActiveTab("Sales")}
                      className="p-4 bg-[var(--bg-surface-subtle)] hover:bg-slate-200 text-[var(--text-primary)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] flex flex-col justify-between text-left transition-all cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div>
                        <span className="block text-sm font-bold">View Sales</span>
                        <span className="text-xs text-slate-500">Today&apos;s transactions</span>
                      </div>
                    </button>

                    {/* Action 6: View Reports */}
                    <button
                      onClick={() => setActiveTab("Reports")}
                      className="p-4 bg-[var(--bg-surface-subtle)] hover:bg-slate-200 text-[var(--text-primary)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] flex flex-col justify-between text-left transition-all cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <span className="block text-sm font-bold">View Reports</span>
                        <span className="text-xs text-slate-500">Sales, inventory, GST</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom 3-Column Tables (1:1 with Dashboard Reference) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Low Stock Products */}
                <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      Low Stock Products
                    </h3>
                    <button
                      onClick={() => setActiveTab("Inventory")}
                      className="text-xs font-semibold text-[var(--brand-solid)] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 font-medium text-left">
                        <th className="pb-2">Product</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2 text-center">Stock</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: "iPhone Back Cover", cat: "Mobiles", stock: 3 },
                        { name: "Type-C Fast Cable", cat: "Mobiles", stock: 5 },
                        { name: "Ustraa Perfume 100ml", cat: "Perfumes", stock: 2 },
                        { name: "Matte Lipstick", cat: "Cosmetics", stock: 4 },
                        { name: "Wireless Earbuds", cat: "Mobiles", stock: 6 },
                      ].map((item) => (
                        <tr key={item.name} className="hover:bg-slate-50">
                          <td className="py-2.5 font-semibold text-slate-800">{item.name}</td>
                          <td className="py-2.5 text-slate-500">{item.cat}</td>
                          <td className="py-2.5 text-center font-bold font-mono">{item.stock}</td>
                          <td className="py-2.5 text-right">
                            <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-bold">
                              Low Stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Column 2: Top Selling Products */}
                <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      Top Selling Products
                    </h3>
                    <button
                      onClick={() => setActiveTab("Products")}
                      className="text-xs font-semibold text-[var(--brand-solid)] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 font-medium text-left">
                        <th className="pb-2 w-6">#</th>
                        <th className="pb-2">Product</th>
                        <th className="pb-2 text-center">Sold</th>
                        <th className="pb-2 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { rank: 1, name: "Type-C Fast Cable", sold: 28, rev: "₹6,972" },
                        { rank: 2, name: "Mobile Back Cover", sold: 22, rev: "₹6,578" },
                        { rank: 3, name: "Ustraa Perfume 100ml", sold: 15, rev: "₹8,985" },
                        { rank: 4, name: "Wireless Earbuds", sold: 12, rev: "₹17,988" },
                        { rank: 5, name: "Matte Lipstick", sold: 11, rev: "₹3,839" },
                      ].map((item) => (
                        <tr key={item.name} className="hover:bg-slate-50">
                          <td className="py-2.5 font-bold text-slate-400">{item.rank}</td>
                          <td className="py-2.5 font-semibold text-slate-800">{item.name}</td>
                          <td className="py-2.5 text-center font-mono text-slate-600">{item.sold}</td>
                          <td className="py-2.5 text-right font-bold font-mono text-slate-800">
                            {item.rev}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Column 3: Recent Sales */}
                <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      Recent Sales
                    </h3>
                    <button
                      onClick={() => setActiveTab("Sales")}
                      className="text-xs font-semibold text-[var(--brand-solid)] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 font-medium text-left">
                        <th className="pb-2">Invoice</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2 text-center">Items</th>
                        <th className="pb-2 text-right">Amount</th>
                        <th className="pb-2 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { inv: "#INV-1008", cust: "Walk-In", items: 3, amt: "₹1,299", time: "09:32 AM" },
                        { inv: "#INV-1007", cust: "+91 98765 43210", items: 1, amt: "₹499", time: "09:15 AM" },
                        { inv: "#INV-1006", cust: "Walk-In", items: 5, amt: "₹2,354", time: "08:48 AM" },
                        { inv: "#INV-1005", cust: "+91 91234 56789", items: 2, amt: "₹799", time: "08:21 AM" },
                        { inv: "#INV-1004", cust: "Walk-In", items: 1, amt: "₹349", time: "07:56 AM" },
                      ].map((item) => (
                        <tr key={item.inv} className="hover:bg-slate-50">
                          <td className="py-2.5 font-bold text-[var(--brand-solid)] font-mono">{item.inv}</td>
                          <td className="py-2.5 text-slate-600 truncate max-w-[90px]">{item.cust}</td>
                          <td className="py-2.5 text-center font-mono">{item.items}</td>
                          <td className="py-2.5 text-right font-bold font-mono text-slate-900">{item.amt}</td>
                          <td className="py-2.5 text-right text-slate-400 font-mono">{item.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
