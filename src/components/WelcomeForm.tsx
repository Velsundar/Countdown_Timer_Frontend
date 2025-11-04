"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { apiClient } from "@/app/lib/api-client";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/components/NotificationToast";


const formSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function WelcomeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // setMessage(null);
    try {
      const res = await apiClient("/users", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.success) {
        showSuccess(res.message);
        localStorage.setItem("weddingUser", JSON.stringify(res.data));
        // slight delay for UX feedback
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        showError(res.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mt-8 border border-champagneGold"
    >
      <h1 className="text-3xl font-serif text-roseGold text-center mb-4">
        Sundaravel & Ranjitha
      </h1>
      <p className="text-center text-charcoal mb-6">
        Our Journey Begins 💍 — join us by entering your details below
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Name
          </label>
          <input
            {...register("name")}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-roseGold"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-roseGold"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Phone (optional)
          </label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-roseGold"
            placeholder="+91 98765 43210"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-roseGold text-white font-semibold py-2 rounded-lg hover:bg-deepRed transition"
        >
          {loading ? "Saving..." : "Join the Celebration"}
        </button>
      </form>

      {/* {message && (
        <p className="text-center mt-4 text-sm text-charcoal">{message}</p>
      )} */}
    </motion.div>
  );
}
