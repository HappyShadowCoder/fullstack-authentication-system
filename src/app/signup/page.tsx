"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpPage() {
  // State for user input
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  // State for button status and loading
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignUp = async () => {
    try {
      setLoading(true);
      // Make a real API call to your backend
      const response = await axios.post("/api/users/signup", user);

      console.log("Sign Up Successful: ", response.data);
      toast.success(response.data.message);

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred.";
      console.log("Sign Up failed: ", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  // Handle input changes
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900 p-4 font-sans">
      <Toaster />
      <div className="bg-gray-800 dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          {loading ? "Processing..." : "Sign Up"}
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSignUp();
          }}
          className="space-y-6"
        >
          {/* Username Input Field */}
          <div className="relative">
            <input
              type="text"
              id="username"
              value={user.username}
              onChange={onInputChange}
              placeholder=" "
              className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 peer placeholder-transparent"
            />
            <label
              htmlFor="username"
              className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-indigo-500"
            >
              Username
            </label>
          </div>

          {/* Email Input Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={onInputChange}
              placeholder=" "
              className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 peer placeholder-transparent"
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-indigo-500"
            >
              Email Address
            </label>
          </div>

          {/* Password Input Field */}
          <div className="relative">
            <input
              type="password"
              id="password"
              value={user.password}
              onChange={onInputChange}
              placeholder=" "
              className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 peer placeholder-transparent"
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-indigo-500"
            >
              Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200
                          ${
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
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          <a
            href="/login"
            className="text-indigo-500 hover:underline cursor-pointer"
          >
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
