// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import AuthLayout from "../components/auth/AuthLayout";
// import LoginForm from "../components/auth/LoginForm"; 
// import ProfileForm from "../components/auth/Profile"; 

// type AuthStep = "login" | "profile";

// export default function LoginPage() {
//   const [step, setStep] = useState<AuthStep>("login");
//   const router = useRouter();

//   const handleLoginSuccess = (isNewUser: boolean) => {
//     if (isNewUser) {
//       setStep("profile"); // Switch the inner content to Profile
//     } else {
//       router.push("/admin/dashboard");
//     }
//   };

//   return (
//     <AuthLayout>
//       {step === "login" ? (
//         <LoginForm onSuccess={handleLoginSuccess} />
//       ) : (
//         <ProfileForm onComplete={() => router.push("/admin/dashboard")} />
//       )}
//     </AuthLayout>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import ProfileForm from "../components/auth/Profile";
import OTPVerification from "../components/auth/OTPVerification";

type AuthStep = "login" | "otp" | "profile";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>("login");
  const [userEmail, setUserEmail] = useState(""); 
  const router = useRouter();

  const handleLoginSuccess = (user: any, email: string, isGoogle: boolean) => {
    setUserEmail(email);
    
    // Check if profile is complete (Assuming 'name' is the field to check)
    const isProfileComplete = !!user.name;

    // SCENARIO 1: Google Login (Always skip OTP)
    if (isGoogle) {
      if (!isProfileComplete) {
        setStep("profile");
      } else {
        router.push("/admin/dashboard");
      }
    } 
    // SCENARIO 2: Email/Pass Login
    else {
      // If Email is NOT verified, force OTP
      if (user.isEmailVerified === false) {
        setStep("otp");
      } 
      // If Email IS verified but profile not set
      else if (!isProfileComplete) {
        setStep("profile");
      } 
      // All good
      else {
        router.push("/admin/dashboard");
      }
    }
  };

  return (
    <AuthLayout>
      {step === "login" && (
        <LoginForm onSuccess={handleLoginSuccess} />
      )}
      {step === "otp" && (
        <OTPVerification 
          email={userEmail} 
          onSuccess={() => setStep("profile")} 
          onBack={() => setStep("login")}
        />
      )}
      {step === "profile" && (
        <ProfileForm onComplete={() => router.push("/admin/dashboard")} />
      )}
    </AuthLayout>
  );
}