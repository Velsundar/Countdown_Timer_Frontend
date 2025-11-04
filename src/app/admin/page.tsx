"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Compare with environment variable (client-side token)
    if (token === process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      localStorage.setItem("adminToken", token);
      router.push("/admin/dashboard");
    } else {
      setError("Invalid token. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-md border border-champagneGold w-full max-w-md"
      >
        <h1 className="text-3xl font-serif text-roseGold mb-4 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter admin token"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-roseGold"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-roseGold text-white py-2 rounded-lg hover:bg-deepRed transition"
          >
            Login
          </button>
        </form>
      </motion.div>
    </main>
  );
}
