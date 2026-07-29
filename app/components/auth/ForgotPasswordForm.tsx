"use client";
import { useState } from "react";

export default function ForgotPasswordForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) onSuccess(email);
    else alert("Error sending OTP");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <img src="/Logo.png" alt="logo" className="w-12 h-auto mb-4 mx-auto" />
      <h2 className="text-xl font-bold text-center mb-6 text-black">Enter your registered email address to receive a verification OTP.</h2>
      <form onSubmit={handleSubmit}>
        <label className="text-sm text-gray-500">Email address</label>
        <input type="email" required placeholder="Enter your email address" className="w-full text-black mt-2 p-3 border rounded-lg mb-6" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-bold">{loading ? "Sending..." : "Confirm"}</button>
      </form>
    </div>
  );
}