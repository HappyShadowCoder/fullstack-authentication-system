"use client";
// The following server-side imports have been removed from this client component:
// import {connect} from "@/dbConfig/dbConfig"
// import User from "@/models/userModel"
// import { NextRequest , NextResponse } from "next/server"
// The useRouter hook from 'next/navigation' has been removed
// because it was causing a compilation error.
import React, { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// The database connection call has been removed from this client component.
// connect()

export default function ForgotPasswordPage() {
  // The useRouter hook call has been removed.
  const [email, setEmail] = React.useState({
    email: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState("forgot-password");

  const sendResetPasswordEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", {
        email: email.email,
      });

      console.log("Reset Password Email Successfully Sent! ", response.data);
      // Set currentPage to "reset-password" on success
      setCurrentPage("reset-password");
    } catch (error: any) {
      // ✅ Improved error handling to avoid double toasts
      const errorMessage =
        error?.response?.data?.error ||
        error.message ||
        "Unknown error occurred";
      console.log("🚨 Oops! Email delivery crashed: ", errorMessage);
      toast.error("🚨 " + errorMessage); // <-- Single, descriptive toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email.email.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Toaster />
      {currentPage === "forgot-password" && (
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          buttonDisabled={buttonDisabled}
          loading={loading}
          sendResetPasswordEmail={sendResetPasswordEmail}
        />
      )}
      {currentPage === "reset-password" && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            A password reset link has been sent. Please check your inbox.
          </p>
        </div>
      )}
    </div>
  );
}

type ForgotPasswordFormProps = {
  email: { email: string };
  setEmail: React.Dispatch<React.SetStateAction<{ email: string }>>;
  buttonDisabled: boolean;
  loading: boolean;
  sendResetPasswordEmail: () => void;
};

const ForgotPasswordForm = ({
  email,
  setEmail,
  buttonDisabled,
  loading,
  sendResetPasswordEmail,
}: ForgotPasswordFormProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
        Forgot Password
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400">
        Enter your email to receive a password reset link.
      </p>

      {/* Email Input Field */}
      <div className="relative">
        <input
          type="email"
          id="email"
          value={email.email}
          onChange={(e) => setEmail({ ...email, email: e.target.value })}
          placeholder=" "
          className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 peer placeholder-transparent"
        />
        <label
          htmlFor="email"
          className="absolute left-4 -top-3.5 text-gray-600 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-indigo-500"
        >
          Email Address
        </label>
      </div>

      {/* Submit Button */}
      <button
        onClick={sendResetPasswordEmail}
        disabled={buttonDisabled || loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200
          ${
            buttonDisabled || loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
          }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white inline-block mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Send Reset Link"
        )}
      </button>
    </div>
  );
};
