"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import AuthLayout from "../components/auth/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import OTPResetVerification from "../components/auth/OTPResetVerification";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const router = useRouter(); // 2. Initialize router

  return (
    <AuthLayout>
      {step === "email" && (
        <ForgotPasswordForm 
          onSuccess={(e) => { setEmail(e); setStep("otp"); }} 
        />
      )}
      
      {step === "otp" && (
        <OTPResetVerification 
          email={email} 
          onSuccess={(otp) => { setVerifiedOtp(otp); setStep("reset"); }} 
          onBack={() => setStep("email")}
        />
      )}
      
      {step === "reset" && (
        <ResetPasswordForm 
          email={email} 
          otp={verifiedOtp} 
          // 3. Navigate to login on success
          onSuccess={() => router.push("/login")} 
        />
      )}
    </AuthLayout>
  );
}