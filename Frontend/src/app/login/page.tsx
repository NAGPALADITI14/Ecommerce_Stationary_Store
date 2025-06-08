"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
    const body = isSignup ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        // Set cookie (keep your existing logic)
        document.cookie = `token=${data.token}; path=/`;
        
        // Update auth context with user data
        const userData = {
          id: data.user?.id || data.id || email, // Adjust based on your API response
          name: data.user?.name || name,
          email: data.user?.email || email,
          phone: data.user?.phone || undefined,
        };
        
        // Login through context (this will handle localStorage)
        login(userData, data.token);
        
        // Redirect to homepage
        router.push("/homepage");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleAuth} className="p-6 bg-white shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 p-2 rounded mb-2 text-black focus:outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded mb-2 text-black focus:outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded mb-2 text-black focus:outline-none focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isSignup ? "Signing Up..." : "Logging In..."}
            </div>
          ) : (
            isSignup ? "Sign Up" : "Login"
          )}
        </button>

        <p className="text-sm text-gray-600 text-center">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(""); // Clear error when switching
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
}