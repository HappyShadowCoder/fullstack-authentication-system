"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Verify Email</h1>

        {token && !verified && !error && (
          <p className="text-gray-300 text-sm mb-4">Verifying your email...</p>
        )}

        {verified && (
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-4">
              ✅ Email verified successfully!
            </h2>
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {error && (
          <div>
            <h2 className="text-xl font-semibold text-red-400 mb-4">
              ❌ Verification failed
            </h2>
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Back to Login
            </Link>
          </div>
        )}

        {!token && (
          <p className="text-red-400">
            No token found in the verification link.
          </p>
        )}
      </div>
    </div>
  );
}
