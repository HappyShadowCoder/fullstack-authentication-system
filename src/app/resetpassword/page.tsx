"use client";
import React, { useEffect, useState } from "react";
// The 'useRouter' hook from 'next/navigation' is not needed and has been removed.
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPasswordPage() {
  // This state is not needed as we can use window.location directly
  // const router = useRouter();
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const onResetPassword = async () => {
    console.log("New Password:", passwords.password.trim());
    console.log("Confirm Password:", passwords.confirmPassword.trim());

    try {
      setLoading(true);

      // Use the passwordsMatch state for the condition
      if (!passwordsMatch) {
        toast.error("Passwords do not match.");
        setLoading(false);
        return;
      }

      if (!token) {
        toast.error("Invalid or missing token.");
        setLoading(false);
        return;
      }

      // Making a real API call to your backend
      const response = await axios.post("/api/users/resetpassword", {
        token,
        password: passwords.password,
        confirmPassword: passwords.confirmPassword, // <-- Now sending both passwords
      });

      console.log("Password reset successful!", response.data);
      toast.success(response.data.message);

      setResetSuccess(true);

      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred.";
      console.log("Password reset failed : ", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Updated useEffect to handle password matching logic
  useEffect(() => {
    const match =
      passwords.password.trim() === passwords.confirmPassword.trim();
    setPasswordsMatch(match);

    if (
      passwords.password.length > 0 &&
      passwords.confirmPassword.length > 0 &&
      match
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [passwords]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900 p-4 font-sans">
      <Toaster />
      <div className="bg-gray-800 dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        {/* Conditional rendering based on resetSuccess state */}
        {resetSuccess ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              Password Reset Successful!
            </h1>
            <p className="mt-4 text-gray-400">
              Your password has been changed. You can now log in with your new
              password.
            </p>
            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              className="mt-6 w-full py-3 px-4 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-colors duration-200"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-center text-white">
              Reset Password
            </h1>

            {/* New Password Input Field */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={passwords.password}
                onChange={(e) =>
                  setPasswords({ ...passwords, password: e.target.value })
                }
                placeholder=" "
                className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 peer placeholder-transparent"
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-indigo-500"
              >
                New Password
              </label>
            </div>

            {/* Confirm Password Input Field */}
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder=" "
                className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 peer placeholder-transparent"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-indigo-500"
              >
                Confirm New Password
              </label>
            </div>

            {/* Password match indicator */}
            {passwords.password && passwords.confirmPassword && (
              <p
                className={`text-sm text-center ${
                  passwordsMatch ? "text-green-500" : "text-red-500"
                }`}
              >
                {passwordsMatch
                  ? "Passwords match! ✅"
                  : "Passwords do not match. ❌"}
              </p>
            )}

            {/* Submit Button */}
            <button
              onClick={onResetPassword}
              disabled={buttonDisabled || loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200
                ${
                  buttonDisabled || loading
                    ? "bg-gray-500 dark:bg-gray-600 cursor-not-allowed"
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
                "Set New Password"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
