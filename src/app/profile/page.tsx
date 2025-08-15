"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  // State to store the user's email and username
  const [user, setUser] = useState({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        // This is the actual API call to your backend
        const response = await axios.get("/api/users/me");

        // CORRECTED: Access the actual user data from the 'data' property of the response
        setUser(response.data.data);
      } catch (error: any) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details.");
        // Redirect to login page if fetching user details fails
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const logout = async () => {
    try {
      // This is the actual API call to your backend to log the user out
      const response = await axios.get("/api/users/logout");

      toast.success(response.data.message);
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4">
      <Toaster />
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 text-center">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <svg
              className="animate-spin h-8 w-8 text-white"
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
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-white">Profile Page</h1>
            <p className="text-gray-400">Welcome, you are logged in as:</p>
            <p className="text-xl font-semibold text-indigo-400">
              {user.username}
            </p>
            <p className="text-sm text-gray-400">({user.email})</p>
            <button
              onClick={logout}
              className="w-full py-3 px-4 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors duration-200 mt-6"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
