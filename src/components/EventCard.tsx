"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/app/lib/api-client";
import { useRouter } from "next/navigation";

interface EventCardProps {
  title: string;
  eventKey: "engagement" | "marriage";
}

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

export default function EventCard({ title, eventKey }: EventCardProps) {
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const res = await apiClient(`/countdown/${eventKey}`);
        setCountdown(res.remaining);
      } catch (err) {
        console.error("Error fetching countdown:", err);
      }
    };

    fetchCountdown();
    const interval = setInterval(fetchCountdown, 60_000);
    return () => clearInterval(interval);
  }, [eventKey]);

  const handleClick = () => {
    router.push(`/countdown/${eventKey}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md border border-champagneGold p-5 w-full max-w-sm hover:shadow-lg text-center select-none"
    >
      <h2 className="text-2xl font-serif text-roseGold mb-2">{title}</h2>

      {countdown ? (
        <div>
          {countdown.isOver ? (
            <p className="text-charcoal text-sm">🎉 Event completed!</p>
          ) : (
            <p className="text-charcoal">
              <span className="text-3xl font-semibold">{countdown.days}</span>
              <span className="text-lg ml-1">days left</span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Loading countdown...</p>
      )}
    </motion.div>
  );
}
