"use client";

import { useState, useRef, useEffect } from "react";
import StatusModal from "./StatusModal";

interface OTPProps {
  email: string;
  onSuccess: (otp: string) => void; // Interface expects a string
  onBack: () => void;
}

export default function OTPResetVerification({ email, onSuccess, onBack }: OTPProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifiedCode, setVerifiedCode] = useState(""); // 1. Added state to hold the code
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return;

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      if (!res.ok) throw new Error("Invalid or expired OTP");
      
      // 2. Save the successfully verified code to state
      setVerifiedCode(code); 
      
      setModal({ isOpen: true, type: "success", title: "Verified", message: "Your OTP Has Been Verified" });
    } catch (err: any) {
      setModal({ isOpen: true, type: "error", title: "Wrong OTP", message: "You Have Entered Wrong OTP" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to resend code");
      
      setModal({ 
        isOpen: true, 
        type: "success", 
        title: "OTP Sent", 
        message: "Your OTP Has Been Sent to Your Registered Email Address" 
      });
      setTimeLeft(120); 
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setModal({ isOpen: true, type: "error", title: "Error", message: "Could not resend OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    const isSuccess = modal.title === "Verified";
    setModal({ ...modal, isOpen: false });
    
    // 3. Pass the saved verifiedCode when calling onSuccess
    if (isSuccess && verifiedCode) {
      onSuccess(verifiedCode);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      <StatusModal 
        isOpen={modal.isOpen}
        onClose={handleModalClose}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
      
      <img src="/Logo.png" alt="logo" className="w-12 h-auto mb-4" />
      <h2 className="text-2xl font-bold text-[#0D0D12] mb-2">Verify Your Code</h2>
      <p className="text-gray-500 text-center mb-6">
        Enter the 6-digit code we emailed you to verify it's you.
      </p>

      <div className="flex gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            ref={(el) => { inputRefs.current[index] = el; }}
            className="w-14 h-16 text-black text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:border-black focus:outline-none"
          />
        ))}
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm mb-1">
          {timeLeft > 0 
            ? `Resend code in ${formatTime(timeLeft)}` 
            : "Didn't receive a verification code?"}
        </p>
        
        <button 
          onClick={handleResend}
          disabled={timeLeft > 0 || loading}
          className={`font-medium hover:underline ${timeLeft > 0 ? "text-gray-500 cursor-not-allowed" : "text-blue-600"}`}
        >
          Resend Code
        </button>
      </div>
      
      <button 
        onClick={handleVerify}
        disabled={loading || otp.join("").length < 6 || timeLeft === 0}
        className="w-full bg-[#0D0D12] text-white py-3 rounded-lg font-medium hover:bg-black transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
      
      <button 
        onClick={onBack}
        className="w-full bg-white text-[#0D0D12] border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
      >
        Go back
      </button>
    </div>
  );
}