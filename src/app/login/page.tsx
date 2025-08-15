"use client";
import React, { useEffect, useState } from "react";
// Toaster was not imported, causing the ReferenceError
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // This is the main function to handle the login attempt
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    const toastId = toast.loading("Logging in...");

    try {
      setLoading(true);

      // We are now making a real API call to your login endpoint
      const response = await axios.post("/api/users/login", user);

      toast.dismiss(toastId);
      toast.success(response.data.message); // Display the success message from the API

      // If login is successful, redirect the user
      // We will now wait for 1 second before redirecting
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    } catch (error: any) {
      toast.dismiss(toastId);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage); // Display the specific error message from the API
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  // This useEffect will enable or disable the button based on input
  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 font-sans">
      <Toaster />
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          {loading ? "Processing..." : "Login"}
        </h1>

        <form onSubmit={onLogin} className="space-y-6">
          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-white text-sm">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={onInputChange}
              className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-white text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={user.password}
              onChange={onInputChange}
              className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <a
              href="/forgotpassword"
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
              buttonDisabled || loading
                ? "bg-gray-500 cursor-not-allowed"
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
              "Login"
            )}
          </button>
        </form>

        {/* Sign Up */}
        <div className="text-center text-sm">
          <a
            href="/signup"
            className="text-indigo-500 hover:underline cursor-pointer"
          >
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
