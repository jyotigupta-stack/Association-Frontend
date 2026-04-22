"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm"; 
import ProfileForm from "../components/auth/Profile"; 

type AuthStep = "login" | "profile";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>("login");
  const router = useRouter();

  const handleLoginSuccess = (isNewUser: boolean) => {
    if (isNewUser) {
      setStep("profile"); // Switch the inner content to Profile
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <AuthLayout>
      {step === "login" ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <ProfileForm onComplete={() => router.push("/admin/dashboard")} />
      )}
    </AuthLayout>
  );
}
