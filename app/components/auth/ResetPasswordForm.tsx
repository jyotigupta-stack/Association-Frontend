"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface ResetPasswordProps {
  email: string;
  otp: string;
  onSuccess: () => void;
}

export default function ResetPasswordForm({ email, otp, onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation Rules
  const checks = {
    length: password.length >= 8,
    mixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*]/.test(password),
  };

  const isFormValid = Object.values(checks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,  newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col items-center mb-6">
        <img src="/Logo.png" alt="logo" className="w-12 h-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#0D0D12]">Create New Password</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="text-sm text-gray-500 mb-1 block">New password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:border-black text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Validation Checklist */}
        <div className="space-y-3 mb-8">
          {[
            { label: "A minimum of 8 characters", valid: checks.length },
            { label: "Lower and uppercase letters", valid: checks.mixed },
            { label: "At least 1 number", valid: checks.number },
            { label: "At least 1 symbol", valid: checks.symbol },
          ].map((item, index) => (
            <div key={index} className={`flex items-center gap-2 text-sm ${item.valid ? "text-green-600" : "text-gray-700"}`}>
              <CheckCircle2 size={16} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full bg-[#0D0D12] text-white py-3 rounded-lg font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="text-sm text-gray-400 text-center mt-8">
        You agree to our <span className="text-black cursor-pointer underline">Terms of Use</span> and
        <span className="text-black cursor-pointer underline"> Privacy Policy</span> by continuing.
      </p>
    </div>
  );
}