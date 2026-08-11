"use client";


import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 
import { GoogleLogin } from "@react-oauth/google";
interface LoginFormProps {
  onSuccess: (isNewUser: boolean) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // New state for eye toggle
  const [showPassword, setShowPassword] = useState(false);

  //  Error states
  const [emailError, setEmailError] =
    useState("");

  const [passwordError,
    setPasswordError] =
    useState("");

  /* Email validation */

  const validateEmail = (email: string) => {

    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {

      setEmailError(
        "Enter a valid email address"
      );

      return false;

    }

    setEmailError("");

    return true;

  };

  /* Strong password check */

  const validatePassword =
    (password: string) => {

    const strongRegex =
      /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

    if (!strongRegex.test(password)) {

      setPasswordError(
        "Password must contain at least 6 characters, 1 uppercase letter, and 1 number"
      );

      return false;

    }

    setPasswordError("");

    return true;

  };

  /* Login Handler */

  const handleLogin = async () => {

    setEmailError("");
    setPasswordError("");

    const validEmail =
      validateEmail(email);

    const validPassword =
      validatePassword(password);

    if (
      !validEmail ||
      !validPassword
    ) return;

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
  email,
  password,
  userType: "ASSOCIATION"
}),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        if (
          data.message ===
          "Invalid credentials"
        ) {

          setPasswordError(
            "Incorrect email or password"
          );

        }

        else if (
          data.message ===
          "Use Google login for this account"
        ) {

          setEmailError(
            "This account uses Google login"
          );

        }

        else {

          alert(
            data.message ||
            "Login failed"
          );

        }

        return;

      }

      const isNewUser =
        !data.user.name;

      onSuccess(isNewUser);

    }

    catch {

      alert("Login failed");

    }

    finally {

      setLoading(false);

    }

  };

  return (
    <div className="w-full max-w-md bg-[#F6F8FA] rounded-xl shadow-lg border border-gray-300 ">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

      <div className="flex flex-col items-center mb-6">

        <img
          src="/Logo.png"
          alt="logo"
          className="w-12 mb-3"
        />

        <h2 className=" text-[#0D0D12] text-xl font-semibold">
          Hey there, welcome back!
        </h2>

      </div>

      {/* Email */}

      <div className="mb-4">

        <label className="text-sm text-gray-400">
          Email address
        </label>

        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full text-gray-500 mt-1 p-3 border rounded-lg border-gray-300"
          value={email}
          onChange={(e) => {

              setEmail(
                e.target.value
              );

              validateEmail(
                e.target.value
              );

            }}
        />
        {/* Email Error */}

          {emailError && (

            <p className="text-red-500 text-sm mt-1">

              {emailError}

            </p>

          )}

      </div>

      {/* Password */}

      <div className="mb-6">

        <label className="text-sm text-gray-400">
          Password
        </label>

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full text-gray-400 mt-1 p-3 border rounded-lg border-gray-300 pr-10"
            value={password}
             onChange={(e) => {

                setPassword(
                  e.target.value
                );

                validatePassword(
                  e.target.value
                );

              }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Error */}

          {passwordError && (

            <p className="text-red-500 text-sm mt-1">

              {passwordError}

            </p>

          )}

      </div>

      {/* Button */}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-[#0D0D12] text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
      >
        {loading
          ? "Signing in..."
          : "Confirm"}
      </button>

      {/* Divider */}

      <div className="flex items-center my-6">

        <div className="flex-grow border-t"></div>

        <span className="px-3 text-sm text-gray-400">
          Or
        </span>

        <div className="flex-grow border-t"></div>

      </div>

      {/* Google */}

      {/* <button className="text-black w-full border border-gray-300 shadow-sm py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">

        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <rect width="24" height="24" rx="4.56" fill="white"/>
  <path d="M20.4009 12.1945C20.4009 11.5867 20.3464 11.0023 20.2451 10.4413H12.1724V13.7569H16.7854C16.5867 14.8283 15.9828 15.7361 15.075 16.3439V18.4945H17.8451C19.4659 17.0023 20.4009 14.8049 20.4009 12.1945Z" fill="#4285F4"/>
  <path d="M12.1724 20.5717C14.4867 20.5717 16.427 19.8041 17.8452 18.495L15.0751 16.3444C14.3075 16.8587 13.3257 17.1626 12.1724 17.1626C9.93998 17.1626 8.05036 15.6548 7.37634 13.6288H4.5127V15.8496C5.92309 18.6509 8.82179 20.5717 12.1724 20.5717Z" fill="#34A853"/>
  <path d="M7.37641 13.6283C7.20498 13.114 7.10757 12.5647 7.10757 11.9997C7.10757 11.4348 7.20498 10.8855 7.37641 10.3712V8.15039H4.51276C3.91276 9.34483 3.60055 10.6631 3.60107 11.9997C3.60107 13.3829 3.93224 14.692 4.51276 15.8491L7.37641 13.6283Z" fill="#FBBC05"/>
  <path d="M12.1724 6.83805C13.4309 6.83805 14.5608 7.27052 15.4491 8.11987L17.9075 5.66143C16.4231 4.27831 14.4828 3.42896 12.1724 3.42896C8.82179 3.42896 5.92309 5.34974 4.5127 8.15104L7.37634 10.3718C8.05036 8.34585 9.93998 6.83805 12.1724 6.83805Z" fill="#EA4335"/>
</svg>

        Continue with Google

      </button> */}
      <GoogleLogin
  onSuccess={async (credentialResponse) => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/google-login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            idToken:
              credentialResponse.credential,
            userType: "ASSOCIATION"
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        alert(data.message);

        return;

      }

      const isNewUser =
        !data.user.phone;

      onSuccess(isNewUser);

    }

    catch {

      alert(
        "Google login failed"
      );

    }

  }}

  onError={() => {

    alert(
      "Google login failed"
    );

  }}
/>

      

    </div>
    {/* Footer */}

      <p className="text-sm text-gray-400 text-center mt-6 mb-5">

        You agree to our <span className="text-black">Terms of Use</span> and
        <span className="text-black"> Privacy Policy</span> by continuing.
        
      </p>
      </div>
      
  );
}
