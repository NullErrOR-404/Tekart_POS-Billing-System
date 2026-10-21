"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export function LoginView() {
  const router = useRouter();

  // Desktop Form State
  const [email, setEmail] = useState("admin@tekart.in");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mobile Screen State: 1 = Splash, 2 = Form Login, 3 = Quick PIN
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1);
  const [pin, setPin] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 400);
  };

  const handlePinInput = (val: string) => {
    if (val === "DEL") {
      setPin((prev) => prev.slice(0, -1));
      return;
    }
    if (val === "BIO") {
      // Simulate biometric success
      setIsLoading(true);
      setTimeout(() => {
        router.push("/");
      }, 300);
      return;
    }
    if (pin.length < 4) {
      const nextPin = pin + val;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === "1234" || nextPin === "0000") {
          setIsLoading(true);
          setTimeout(() => {
            router.push("/");
          }, 300);
        } else {
          setTimeout(() => {
            alert("Invalid PIN. Enter 1234 (Admin) or 0000 (Cashier)");
            setPin("");
          }, 150);
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-canvas)] flex flex-col justify-center items-center">
      {/* ----------------------------------------------------------------- */}
      {/* DESKTOP 50/50 SPLIT VIEW (Visible on lg: screens >= 1024px)        */}
      {/* 1:1 Matching 'Desktop reference Login page.png'                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="hidden lg:flex w-full min-h-screen">
        {/* LEFT 50%: Hero Graphic, Value Prop, Features, 3D Counter Graphic */}
        <div className="w-1/2 bg-[var(--bg-canvas)] p-12 xl:p-16 flex flex-col justify-between border-r border-[var(--border-subtle)] relative overflow-hidden">
          {/* Subtle backdrop arc */}
          <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-blue-100/40 pointer-events-none -z-0" />

          {/* Top Brand Statement */}
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase flex items-center gap-2 mb-4">
              <span className="inline-block w-5 h-0.5 bg-slate-400" />
              SMART LIVING
            </span>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-[var(--text-primary)] leading-[1.15] tracking-tight">
              Smarter Billing.
              <br />
              Stronger{" "}
              <span className="text-[var(--brand-solid)]">Business.</span>
            </h1>

            <p className="mt-4 text-base xl:text-lg text-[var(--text-secondary)] max-w-md leading-relaxed font-normal">
              Manage your store, track sales and grow with Tekart POS.
            </p>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-4 gap-4 mt-8 max-w-lg">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[var(--brand-solid)] mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">Fast<br />Billing</span>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[var(--brand-solid)] mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">Real-time<br />Analytics</span>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[var(--brand-solid)] mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">Smart<br />Inventory</span>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[var(--brand-solid)] mb-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">Loyal<br />Customers</span>
              </div>
            </div>
          </div>

          {/* 3D POS Counter Mockup Image */}
          <div className="relative z-10 w-full mt-6 flex justify-center items-end">
            <Image
              src="/images/desktop-login-hero.png"
              alt="Tekart POS Counter"
              width={650}
              height={450}
              className="w-full max-w-[560px] object-contain drop-shadow-sm select-none"
              priority
            />
          </div>
        </div>

        {/* RIGHT 50%: Login Form Container */}
        <div className="w-1/2 bg-[var(--bg-surface)] p-12 xl:p-16 flex items-center justify-center">
          <div className="w-full max-w-[420px] flex flex-col items-center">
            {/* Tekart Official Logo */}
            <div className="mb-8">
              <Image
                src="/images/tekart-logo.png"
                alt="Tekart"
                width={200}
                height={50}
                className="h-10 w-auto object-contain select-none"
                priority
              />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight text-center">
              Welcome Back!
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)] text-center mb-8">
              Sign in to continue to your store
            </p>

            {/* Form */}
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
              {/* Email / Phone */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Phone Number"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] border border-[var(--border-medium)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-solid)] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full h-12 pl-11 pr-11 bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] border border-[var(--border-medium)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-solid)] focus:border-transparent transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert("Contact store owner to reset password.")}
                  className="text-xs font-semibold text-[var(--brand-solid)] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-1 bg-[var(--brand-solid)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-active)] text-white font-semibold text-sm rounded-[var(--radius-md)] flex items-center justify-center gap-2 transition-colors duration-120 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </>
                )}
              </button>

              {/* OR Divider */}
              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-[var(--border-subtle)]" />
                <span className="px-3 text-xs uppercase font-semibold text-slate-400">OR</span>
                <div className="flex-1 border-t border-[var(--border-subtle)]" />
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleLogin}
                className="w-full h-12 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-medium)] rounded-[var(--radius-md)] flex items-center justify-center gap-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-120 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              {/* Quick Switch to PIN */}
              <button
                type="button"
                onClick={() => {
                  const entered = prompt("Enter 4-digit PIN (1234 or 0000):");
                  if (entered === "1234" || entered === "0000") {
                    router.push("/");
                  } else if (entered) {
                    alert("Invalid PIN.");
                  }
                }}
                className="text-xs text-[var(--brand-solid)] font-semibold mt-1 hover:underline cursor-pointer"
              >
                Sign in with 4-Digit Quick PIN instead
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-xs text-slate-500 text-center">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => alert("Please contact store owner for cashier onboarding.")}
                className="font-semibold text-[var(--brand-solid)] hover:underline cursor-pointer"
              >
                Contact Store Owner
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MOBILE 3-STEP FLOW VIEW (Visible on screens < 1024px)              */}
      {/* 1:1 Matching 'mobile login screen flow.png'                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="lg:hidden w-full max-w-md min-h-screen bg-[var(--bg-surface)] flex flex-col justify-between p-6">
        {/* Mobile Top Navigation Bar */}
        <div className="flex items-center justify-between w-full pt-2">
          {mobileStep > 1 ? (
            <button
              onClick={() => setMobileStep((prev) => ((prev - 1) as any))}
              className="p-1 text-slate-600 hover:text-black cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] px-2.5 py-1 border border-[var(--border-subtle)] rounded-[var(--radius-sm)] text-xs font-semibold text-slate-700">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Main Store</span>
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* STEP 1: MOBILE SPLASH SCREEN */}
        {mobileStep === 1 && (
          <div className="flex-1 flex flex-col items-center justify-between py-6">
            <div className="flex flex-col items-center text-center">
              <Image
                src="/images/tekart-logo.png"
                alt="Tekart"
                width={180}
                height={45}
                className="h-9 w-auto object-contain mb-3"
                priority
              />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Simple Billing
              </h2>
              <p className="text-sm font-semibold text-[var(--brand-solid)]">
                Smarter Business
              </p>
            </div>

            {/* Mobile Hero Illustration */}
            <div className="my-6 w-full flex justify-center">
              <Image
                src="/images/mobile-login-hero.png"
                alt="Tekart Mobile POS"
                width={320}
                height={450}
                className="max-h-[380px] w-auto object-contain select-none"
                priority
              />
            </div>

            {/* Pagination Dots & CTA */}
            <div className="w-full flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-solid)]" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              </div>

              <button
                onClick={() => setMobileStep(2)}
                className="w-full h-12 bg-[var(--brand-solid)] text-white font-semibold rounded-[var(--radius-md)] flex items-center justify-center gap-2 cursor-pointer shadow-none active:bg-[var(--brand-active)]"
              >
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MOBILE EMAIL/PASSWORD LOGIN */}
        {mobileStep === 2 && (
          <div className="flex-1 flex flex-col justify-between py-4">
            <div className="flex flex-col items-center">
              <Image
                src="/images/tekart-logo.png"
                alt="Tekart"
                width={160}
                height={40}
                className="h-8 w-auto object-contain mb-6"
                priority
              />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Login to continue to your store
              </p>

              <div className="w-full flex flex-col gap-3">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Phone Number"
                  className="w-full h-12 px-4 bg-[var(--bg-surface)] text-sm border border-[var(--border-medium)] rounded-[var(--radius-md)]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-12 px-4 bg-[var(--bg-surface)] text-sm border border-[var(--border-medium)] rounded-[var(--radius-md)]"
                />

                <div className="flex justify-end">
                  <span className="text-xs text-[var(--brand-solid)] font-semibold">
                    Forgot Password?
                  </span>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full h-12 bg-[var(--brand-solid)] text-white font-semibold rounded-[var(--radius-md)] cursor-pointer mt-2"
                >
                  Login
                </button>

                <div className="flex items-center my-1">
                  <div className="flex-1 border-t border-[var(--border-subtle)]" />
                  <span className="px-3 text-[10px] uppercase font-semibold text-slate-400">OR</span>
                  <div className="flex-1 border-t border-[var(--border-subtle)]" />
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full h-12 bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-sm font-semibold text-slate-700"
                >
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => setMobileStep(3)}
                  className="w-full py-2 text-center text-xs text-[var(--brand-solid)] font-semibold mt-1"
                >
                  Switch to Quick 4-Digit PIN Keypad →
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              New to Tekart?{" "}
              <span className="text-[var(--brand-solid)] font-semibold">
                Contact Store Owner
              </span>
            </p>
          </div>
        )}

        {/* STEP 3: MOBILE 4-DIGIT PIN & BIOMETRIC LOGIN */}
        {mobileStep === 3 && (
          <div className="flex-1 flex flex-col justify-between py-4 items-center">
            <div className="flex flex-col items-center">
              <Image
                src="/images/tekart-logo.png"
                alt="Tekart"
                width={150}
                height={38}
                className="h-7 w-auto object-contain mb-4"
                priority
              />

              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Hi Admin 👋
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Enter your PIN to continue
              </p>

              {/* 4 PIN Dots */}
              <div className="flex gap-4 mb-8">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pin.length > idx
                        ? "bg-[var(--brand-solid)] border-[var(--brand-solid)] scale-110"
                        : "bg-transparent border-slate-300"
                    }`}
                  />
                ))}
              </div>

              {/* 3x4 Number Keypad */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "BIO", "0", "DEL"].map(
                  (key) => (
                    <button
                      key={key}
                      onClick={() => handlePinInput(key)}
                      className="w-20 h-16 rounded-[var(--radius-md)] bg-[var(--bg-surface-subtle)] hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center font-mono text-xl font-bold text-[var(--text-primary)] transition-all cursor-pointer"
                    >
                      {key === "BIO" ? (
                        <svg className="w-6 h-6 text-[var(--brand-solid)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004.07 10.93" />
                        </svg>
                      ) : key === "DEL" ? (
                        <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-7.172a2 2 0 00-1.414.586L3 12z" />
                        </svg>
                      ) : (
                        key
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 mt-6">
              <div className="flex items-center my-1">
                <div className="flex-1 border-t border-[var(--border-subtle)]" />
                <span className="px-3 text-[10px] uppercase font-semibold text-slate-400">OR</span>
                <div className="flex-1 border-t border-[var(--border-subtle)]" />
              </div>

              <button
                type="button"
                onClick={() => handlePinInput("BIO")}
                className="w-full h-12 bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-sm font-semibold text-[var(--brand-solid)] cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004.07 10.93" />
                </svg>
                Use Biometric Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
